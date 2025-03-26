const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (user.rows.length === 0) {
                return res.status(401).json({ message: 'Usuário não encontrado' });
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
            if (!validPassword) {
                return res.status(401).json({ message: 'Senha inválida' });
            }

            const token = jwt.sign({ id: user.rows[0].id }, 'seu_jwt_secret', { expiresIn: '1h' });
            
            await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.rows[0].id]);
            
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },

    register: async (req, res) => {
        try {
            const { username, email, password, full_name } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await pool.query(
                'INSERT INTO users (username, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [username, email, hashedPassword, full_name, 'user']
            );

            res.status(201).json({ message: 'Usuário criado com sucesso' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar usuário' });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (user.rows.length === 0) {
                return res.status(404).json({ message: 'Email não encontrado' });
            }

            // Aqui você implementaria o envio de email com token de reset
            res.json({ message: 'Instruções de reset enviadas para o email' });
        } catch (error) {
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },

    resetPassword: async (req, res) => {
        // Implementação do reset de senha
    }
};

module.exports = authController;
