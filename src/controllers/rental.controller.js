const pool = require('../config/database');

const rentalController = {
    // Listar todas as locações
    getAllRentals: async (req, res) => {
        try {
            console.log('Recebendo solicitação para listar locações');
            const result = await pool.query(`
                SELECT r.*, 
                       s.name as student_name, 
                       p.name as professor_name, 
                       e.name as equipment_name,
                       eg.name as group_name
                FROM rentals r
                LEFT JOIN students s ON r.student_id = s.id
                LEFT JOIN professors p ON r.professor_id = p.id
                LEFT JOIN equipment e ON r.equipment_id = e.id
                LEFT JOIN equipment_groups eg ON r.group_id = eg.id
                ORDER BY r.start_date DESC
            `);

            console.log('Locações encontradas:', result.rows.length); // Log do número de locações encontradas
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar locações:', error); // Log detalhado do erro
            res.status(500).json({ message: 'Erro ao buscar locações' });
        }
    },

    // Obter uma locação por ID
    getRentalById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const result = await pool.query(`
                SELECT r.*, 
                       s.name as student_name, 
                       p.name as professor_name, 
                       e.name as equipment_name,
                       eg.name as group_name
                FROM rentals r
                LEFT JOIN students s ON r.student_id = s.id
                LEFT JOIN professors p ON r.professor_id = p.id
                LEFT JOIN equipment e ON r.equipment_id = e.id
                LEFT JOIN equipment_groups eg ON r.group_id = eg.id
                WHERE r.id = $1
            `, [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Locação não encontrada' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar locação:', error);
            res.status(500).json({ message: 'Erro ao buscar locação' });
        }
    },

    // Criar uma nova locação
    createRental: async (req, res) => {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const { 
                student_id, professor_id, equipment_id, group_id, rental_type, 
                start_date, expected_return_date, created_by 
            } = req.body;
            
            // Verificar se o equipamento está disponível
            if (equipment_id) {
                const equipmentCheck = await client.query(
                    'SELECT status FROM equipment WHERE id = $1',
                    [equipment_id]
                );
                
                if (equipmentCheck.rows.length === 0) {
                    throw new Error('Equipamento não encontrado');
                }
                
                if (equipmentCheck.rows[0].status !== 'disponivel') {
                    throw new Error('Equipamento não está disponível para locação');
                }
                
                // Atualizar status do equipamento
                await client.query(
                    'UPDATE equipment SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                    ['locado', equipment_id]
                );
            }
            
            // Criar a locação
            const result = await client.query(`
                INSERT INTO rentals 
                (student_id, professor_id, equipment_id, group_id, rental_type, status, start_date, expected_return_date, created_by) 
                VALUES ($1, $2, $3, $4, $5, 'ativo', $6, $7, $8)
                RETURNING *
            `, [student_id || null, professor_id || null, equipment_id, group_id, rental_type, start_date, expected_return_date, created_by]);
            
            await client.query('COMMIT');
            res.status(201).json(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro ao criar locação:', error);
            res.status(500).json({ message: error.message || 'Erro ao criar locação' });
        } finally {
            client.release();
        }
    },

    // Finalizar uma locação
    finishRental: async (req, res) => {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const { id } = req.params;
            const { actual_return_date } = req.body;
            
            // Buscar a locação
            const rentalCheck = await client.query(
                'SELECT * FROM rentals WHERE id = $1',
                [id]
            );
            
            if (rentalCheck.rows.length === 0) {
                throw new Error('Locação não encontrada');
            }
            
            const rental = rentalCheck.rows[0];
            
            if (rental.status === 'finalizado') {
                throw new Error('Locação já está finalizada');
            }
            
            // Atualizar a locação
            const result = await client.query(`
                UPDATE rentals 
                SET status = 'finalizado', actual_return_date = $1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `, [actual_return_date || new Date(), id]);
            
            // Se for locação individual, liberar o equipamento
            if (rental.equipment_id) {
                await client.query(
                    'UPDATE equipment SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                    ['disponivel', rental.equipment_id]
                );
            }
            
            await client.query('COMMIT');
            res.json(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro ao finalizar locação:', error);
            res.status(500).json({ message: error.message || 'Erro ao finalizar locação' });
        } finally {
            client.release();
        }
    },

    // Atualizar status de locações atrasadas
    updateOverdueRentals: async (req, res) => {
        try {
            const result = await pool.query(`
                UPDATE rentals 
                SET status = 'atrasado', updated_at = CURRENT_TIMESTAMP
                WHERE status = 'ativo' AND expected_return_date < CURRENT_DATE
                RETURNING *
            `);
            
            res.json({ 
                message: 'Status de locações atrasadas atualizado',
                updated: result.rows.length
            });
        } catch (error) {
            console.error('Erro ao atualizar locações atrasadas:', error);
            res.status(500).json({ message: 'Erro ao atualizar locações atrasadas' });
        }
    },

    // Obter estatísticas de locações para o dashboard
    getRentalStats: async (req, res) => {
        try {
            const stats = await pool.query(`
                SELECT
                    COUNT(*) FILTER (WHERE status = 'ativo') as ativas,
                    COUNT(*) FILTER (WHERE status = 'atrasado') as atrasadas,
                    COUNT(*) FILTER (WHERE status = 'finalizado') as finalizadas,
                    COUNT(*) FILTER (WHERE status = 'ativo' AND rental_type = 'individual') as ativas_individual,
                    COUNT(*) FILTER (WHERE status = 'ativo' AND rental_type = 'group') as ativas_group
                FROM rentals
            `);
            
            res.json(stats.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar estatísticas de locações:', error);
            res.status(500).json({ message: 'Erro ao buscar estatísticas' });
        }
    }
};

module.exports = rentalController;
