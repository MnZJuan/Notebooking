const pool = require('../config/database');

const professorController = {
    getAllProfessors: async (req, res) => {
        try {
            console.log('Recebendo solicitação para listar professores');
            const result = await pool.query('SELECT * FROM professors ORDER BY name');
            console.log('Professores encontrados:', result.rows.length);
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar professores:', error);
            res.status(500).json({ message: 'Erro ao buscar professores' });
        }
    },

    createProfessor: async (req, res) => {
        try {
            const { name, email, department } = req.body;

            console.log('Dados recebidos para criar professor:', { name, email, department });

            const result = await pool.query(`
                INSERT INTO professors (name, email, department) 
                VALUES ($1, $2, $3) 
                RETURNING *
            `, [name, email, department]);

            console.log('Professor criado com sucesso:', result.rows[0]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao criar professor:', error);

            // Verificar se o erro é de duplicidade
            if (error.code === '23505') {
                res.status(400).json({ message: 'E-mail já cadastrado para outro professor.' });
            } else {
                res.status(500).json({ message: 'Erro ao criar professor' });
            }
        }
    },

    getProfessorStats: async (req, res) => {
        try {
            console.log('Iniciando consulta de estatísticas de professores...');

            // Consulta SQL única para obter todas as estatísticas
            const statsQuery = `
                SELECT 
                    (SELECT COUNT(*) FROM professors) AS total,
                    (SELECT COUNT(*) FROM professors WHERE status = 'ativo') AS ativos,
                    (SELECT COUNT(*) FROM professors WHERE status = 'inativo') AS inativos
            `;

            const result = await pool.query(statsQuery);

            if (!result.rows || result.rows.length === 0) {
                console.error('Nenhum dado retornado pela consulta de estatísticas.');
                return res.status(500).json({ message: 'Erro ao buscar estatísticas de professores' });
            }

            // Retornar as estatísticas
            const stats = result.rows[0];
            console.log('Estatísticas de professores obtidas com sucesso:', stats);

            res.json({
                total: parseInt(stats.total, 10),
                ativos: parseInt(stats.ativos, 10),
                inativos: parseInt(stats.inativos, 10),
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas de professores:', error);
            res.status(500).json({ message: 'Erro ao buscar estatísticas de professores' });
        }
    }
};

module.exports = professorController;
