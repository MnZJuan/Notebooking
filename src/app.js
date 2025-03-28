require('dotenv').config(); // Certifique-se de que o dotenv está carregado no início do arquivo

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');

const app = express();

// Middlewares
app.use(cors()); // Certifique-se de que o CORS está habilitado
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de solicitações para depuração
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Servir arquivos estáticos da pasta pages (na raiz do projeto, não dentro de public)
app.use('/pages', express.static(path.join(__dirname, '../pages')));

// Servir arquivos estáticos da pasta assets
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Rota para qualquer outra solicitação (serve o arquivo index.html)
app.get('*', (req, res) => {
  // Exclui chamadas de API e arquivos estáticos
  if (!req.path.startsWith('/api') && !req.path.startsWith('/pages') && 
      !req.path.startsWith('/assets') && !req.path.includes('.')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// Tratamento para rotas não encontradas
app.use('/api/*', (req, res) => {
  console.log(`404 - Rota não encontrada: ${req.originalUrl}`);
  res.status(404).json({ message: `Rota não encontrada: ${req.originalUrl}` });
});

// Manipulação de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
