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
    }
};

module.exports = professorController;
