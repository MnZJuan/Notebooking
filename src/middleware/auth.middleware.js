const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log('Token recebido:', token); // Log para verificar o token recebido

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        console.log('Token verificado com sucesso:', verified); // Log do token verificado
        req.user = verified;
        next();
    } catch (error) {
        console.error('Erro ao verificar o token:', error.message);
        res.status(400).json({ message: 'Token inválido' });
    }
};

module.exports = { verifyToken };
