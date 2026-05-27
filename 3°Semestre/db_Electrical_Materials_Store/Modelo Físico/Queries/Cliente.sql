CREATE TABLE `cliente` (
  `Cod_Cliente` INT NOT NULL,
  `Nome` VARCHAR(45) NULL,
  `Logradouro` VARCHAR(255) NULL,
  `Telefone` VARCHAR(25) NULL,
  `Email` VARCHAR(45) NULL,
  `Atividade` BIT(1) NULL,
  PRIMARY KEY (`Cod_Cliente`));
