-- Criar o banco de dados
CREATE DATABASE notebooking;

-- Conectar ao banco de dados
\c notebooking

-- Criar extensão para UUID se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar as tabelas
-- 1. Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 2. Tabela de Grupos de Equipamentos
CREATE TABLE equipment_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Equipamentos
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('notebook', 'tablet')),
    serial_number VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('disponivel', 'locado', 'manutencao')),
    group_id UUID REFERENCES equipment_groups(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 4. Tabela de Alunos
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Locações
CREATE TABLE rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    equipment_id UUID REFERENCES equipment(id),
    group_id UUID REFERENCES equipment_groups(id),
    rental_type VARCHAR(20) NOT NULL CHECK (rental_type IN ('individual', 'group')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('ativo', 'finalizado', 'atrasado')),
    start_date TIMESTAMP NOT NULL,
    expected_return_date TIMESTAMP NOT NULL,
    actual_return_date TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 6. Tabela de Histórico de Manutenção
CREATE TABLE maintenance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES equipment(id),
    description TEXT NOT NULL,
    maintenance_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
    cost DECIMAL(10,2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_equipment_serial ON equipment(serial_number);
CREATE INDEX idx_students_registration ON students(registration_number);
