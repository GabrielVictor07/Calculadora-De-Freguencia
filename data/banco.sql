CREATE DATABASE IF NOT EXISTS calcfaltas;
USE calcfaltas;

-- ==========================
-- TABELA: Usuário (apenas para testes de criação)
-- ==========================
CREATE TABLE usuario (
  ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
  Nome VARCHAR(100) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  SenhaHash VARCHAR(255) NOT NULL,
  DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- TABELA: Unidade Curricular
-- ==========================
CREATE TABLE UnidadeCurricular (
  ID_UC INT AUTO_INCREMENT PRIMARY KEY,
  NomeUC VARCHAR(100) NOT NULL,
  CargaHorariaTotal DECIMAL(10,2) NOT NULL,
  PercentualLimiteFaltas DECIMAL(5,2) NOT NULL,
  HorasPorAula DECIMAL(5,2) NOT NULL,
  DataInicio DATE NOT NULL,
  DataTerminoEstimada DATE NULL
);

-- ==========================
-- TABELA: Falta
-- ==========================
CREATE TABLE Falta (
  ID_Falta INT AUTO_INCREMENT PRIMARY KEY,
  ID_UC_Associada INT NOT NULL,
  DataFalta DATE NOT NULL,
  HorasComputadas DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (ID_UC_Associada) REFERENCES UnidadeCurricular(ID_UC) ON DELETE CASCADE
);