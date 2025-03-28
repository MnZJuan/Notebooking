const pool = require('../config/database');

const equipmentController = {
    // Listar todos os equipamentos
    getAllEquipment: async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT e.*, eg.name as group_name 
                FROM equipment e
                LEFT JOIN equipment_groups eg ON e.group_id = eg.id
                ORDER BY e.name
            `);
            
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar equipamentos:', error);
            res.status(500).json({ message: 'Erro ao buscar equipamentos' });
        }
    },

    // Obter um equipamento por ID
    getEquipmentById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const result = await pool.query(`
                SELECT e.*, eg.name as group_name 
                FROM equipment e
                LEFT JOIN equipment_groups eg ON e.group_id = eg.id
                WHERE e.id = $1
            `, [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Equipamento não encontrado' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar equipamento:', error);
            res.status(500).json({ message: 'Erro ao buscar equipamento' });
        }
    },

    // Criar um novo equipamento
    createEquipment: async (req, res) => {
        try {
            const { name, type, serial_number, status, group_id, description } = req.body;

            // Verificar se os campos obrigatórios estão presentes
            if (!name || !type || !status) {
                return res.status(400).json({ message: 'Campos obrigatórios estão faltando' });
            }

            const result = await pool.query(`
                INSERT INTO equipment 
                (name, type, serial_number, status, group_id, description) 
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [name, type, serial_number, status, group_id, description]);

            res.status(201).json(result.rows[0]);
        } catch (error) {
            if (error.code === '23505' && error.constraint === 'equipment_serial_number_key') {
                // Erro de duplicidade no número de série
                return res.status(400).json({ message: 'Número de série já está em uso por outro equipamento.' });
            }

            console.error('Erro ao criar equipamento:', error);
            res.status(500).json({ message: 'Erro ao criar equipamento' });
        }
    },

    // Atualizar um equipamento
    updateEquipment: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, type, serial_number, status, group_id, description } = req.body;
            
            const result = await pool.query(`
                UPDATE equipment 
                SET name = $1, type = $2, serial_number = $3, status = $4, 
                    group_id = $5, description = $6, updated_at = CURRENT_TIMESTAMP
                WHERE id = $7
                RETURNING *
            `, [name, type, serial_number, status, group_id, description, id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Equipamento não encontrado' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar equipamento:', error);
            res.status(500).json({ message: 'Erro ao atualizar equipamento' });
        }
    },

    // Excluir um equipamento
    deleteEquipment: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar se há locações ativas para este equipamento
            const rentalsCheck = await pool.query(`
                SELECT id FROM rentals 
                WHERE equipment_id = $1 AND status != 'finalizado'
            `, [id]);
            
            if (rentalsCheck.rows.length > 0) {
                return res.status(400).json({ 
                    message: 'Não é possível excluir um equipamento com locações ativas'
                });
            }
            
            const result = await pool.query('DELETE FROM equipment WHERE id = $1 RETURNING *', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Equipamento não encontrado' });
            }
            
            res.json({ message: 'Equipamento excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir equipamento:', error);
            res.status(500).json({ message: 'Erro ao excluir equipamento' });
        }
    },

    // Listar grupos de equipamentos
    getEquipmentGroups: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM equipment_groups ORDER BY name');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar grupos de equipamentos:', error);
            res.status(500).json({ message: 'Erro ao buscar grupos de equipamentos' });
        }
    },

    // Obter estatísticas de equipamentos para o dashboard
    getEquipmentStats: async (req, res) => {
        try {
            const stats = await pool.query(`
                SELECT
                    COUNT(*) as total,
                    COUNT(*) FILTER (WHERE status = 'disponivel') as disponivel,
                    COUNT(*) FILTER (WHERE status = 'locado') as locado,
                    COUNT(*) FILTER (WHERE status = 'manutencao') as manutencao
                FROM equipment
            `);
            
            res.json(stats.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar estatísticas de equipamentos:', error);
            res.status(500).json({ message: 'Erro ao buscar estatísticas' });
        }
    }
};

module.exports = equipmentController;
