# Notebooking

Notebooking é um sistema de gerenciamento de locações de equipamentos, desenvolvido para facilitar o controle de empréstimos de dispositivos como notebooks e tablets.

## Funcionalidades
- Gerenciamento de usuários (admin e padrão).
- Cadastro e controle de equipamentos.
- Registro de locações (individual ou em grupo).
- Relatórios e estatísticas no dashboard.
- Recuperação de senha.

## Requisitos
- Node.js (versão 14 ou superior).
- PostgreSQL (versão 12 ou superior).

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/MnZJuan/notebooking.git
   cd notebooking
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Crie um banco de dados PostgreSQL.
   - Execute os scripts em `database/init.sql` e `database/seed.sql` para criar as tabelas e inserir dados iniciais.

4. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`.
   - Atualize as variáveis de ambiente com suas credenciais do banco de dados.

## Execução
1. Inicie o servidor:
   ```bash
   npm start
   ```

2. Acesse o sistema no navegador:
   ```
   http://localhost:3000
   ```

## Estrutura do Projeto
- `src/`: Contém o código do servidor (rotas, controladores, middlewares).
- `public/`: Arquivos estáticos (HTML, CSS, JS).
- `database/`: Scripts SQL para inicialização e dados de teste.
- `assets/`: Recursos adicionais como estilos e utilitários JS.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença
Este projeto está licenciado sob a licença MNZ.