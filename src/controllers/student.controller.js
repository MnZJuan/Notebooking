const pool = require('../config/database');

const studentController = {
    // Listar todos os alunos
    getAllStudents: async (req, res) => {
        try {
            const result = await pool.query('SELECT * FROM students ORDER BY name');
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            res.status(500).json({ message: 'Erro ao buscar alunos' });
        }
    },

    // Obter um aluno por ID
    getStudentById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            res.status(500).json({ message: 'Erro ao buscar aluno' });
        }
    },

    // Criar um novo aluno
    createStudent: async (req, res) => {
        try {
            const { name, grade, email, registration_number } = req.body;
            
            const result = await pool.query(`
                INSERT INTO students 
                (name, grade, email, registration_number) 
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [name, grade, email, registration_number]);
            
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
            res.status(500).json({ message: 'Erro ao criar aluno' });
        }
    },

    // Atualizar um aluno
    updateStudent: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, grade, email, registration_number } = req.body;
            
            const result = await pool.query(`
                UPDATE students 
                SET name = $1, grade = $2, email = $3, registration_number = $4
                WHERE id = $5
                RETURNING *
            `, [name, grade, email, registration_number, id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }
            
            res.json(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            res.status(500).json({ message: 'Erro ao atualizar aluno' });
        }
    },

    // Excluir um aluno
    deleteStudent: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar se há locações ativas para este aluno
            const rentalsCheck = await pool.query(`
                SELECT id FROM rentals 
                WHERE student_id = $1 AND status != 'finalizado'
            `, [id]);
            
            if (rentalsCheck.rows.length > 0) {
                return res.status(400).json({ 
                    message: 'Não é possível excluir um aluno com locações ativas'
                });
            }
            
            const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
            
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Aluno não encontrado' });
            }
            
            res.json({ message: 'Aluno excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir aluno:', error);
            res.status(500).json({ message: 'Erro ao excluir aluno' });
        }
    },

    // Buscar alunos por nome ou número de matrícula
    searchStudents: async (req, res) => {
        try {
            const { query } = req.query;
            
            if (!query) {
                return res.status(400).json({ message: 'Parâmetro de busca é obrigatório' });
            }
            
            const result = await pool.query(`
                SELECT * FROM students 
                WHERE name ILIKE $1 OR registration_number ILIKE $1
                ORDER BY name
                LIMIT 20
            `, [`%${query}%`]);
            
            res.json(result.rows);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
            res.status(500).json({ message: 'Erro ao buscar alunos' });
        }
    }
};

module.exports = studentController;
