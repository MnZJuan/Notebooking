const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Certifique-se de que o módulo está importado corretamente
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Tentativa de login com email:', email);

            const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                console.warn('Usuário não encontrado:', email);
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const user = userResult.rows[0];
            console.log('Usuário encontrado:', user);

            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                console.warn('Senha inválida para o usuário:', email);
                return res.status(401).json({ message: 'Senha inválida' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
            await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

            console.log('Login bem-sucedido para o usuário:', email);
            res.json({ token });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },

    register: async (req, res) => {
        try {
            const { username, email, password, full_name } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(`
                INSERT INTO users (username, email, password_hash, full_name, role)
                VALUES ($1, $2, $3, $4, 'user')
                RETURNING *
            `, [username, email, hashedPassword, full_name]);

            res.status(201).json({ message: 'Usuário criado com sucesso', user: result.rows[0] });
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({ message: 'Erro ao registrar usuário' });
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            console.log('Solicitação de redefinição de senha para o email:', email);

            const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Gerar uma nova senha temporária
            const tempPassword = crypto.randomBytes(8).toString('hex'); // Nova senha de 16 caracteres
            const hashedPassword = await bcrypt.hash(tempPassword, 10); // Hash da nova senha

            // Atualizar o banco de dados com a nova senha
            await pool.query(`
                UPDATE users 
                SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL 
                WHERE email = $2
            `, [hashedPassword, email]);

            console.log('Nova senha gerada e registrada no banco:', tempPassword);

            // Retornar a nova senha no corpo da resposta
            res.json({ 
                message: 'Nova senha gerada com sucesso.',
                tempPassword // Retornar a nova senha
            });
        } catch (error) {
            console.error('Erro ao processar solicitação de redefinição de senha:', error);
            res.status(500).json({ message: 'Erro ao processar solicitação de redefinição de senha' });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            console.log('Solicitação de redefinição de senha com token:', token);

            const userResult = await pool.query(`
                SELECT * FROM users 
                WHERE reset_token = $1 AND reset_token_expiry > CURRENT_TIMESTAMP
            `, [token]);

            if (userResult.rows.length === 0) {
                return res.status(400).json({ message: 'Token inválido ou expirado' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query(`
                UPDATE users 
                SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL 
                WHERE reset_token = $2
            `, [hashedPassword, token]);

            console.log('Senha redefinida com sucesso para o usuário:', userResult.rows[0].email);
            res.json({ message: 'Senha redefinida com sucesso' });
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ message: 'Erro ao redefinir senha' });
        }
    }
};

module.exports = authController;
