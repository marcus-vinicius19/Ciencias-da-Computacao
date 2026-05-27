CREATE TABLE `fornecedor` (
  `Cod_Fornecedor` INT NOT NULL,
  `Razao_Social` VARCHAR(45) NULL,
  `Logradouro` VARCHAR(255) NULL,
  `Telefone` VARCHAR(25) NULL,
  `Email` VARCHAR(45) NULL,
  `Atividade` BIT(1) NULL,
  `Nome_Fantasia` VARCHAR(45) NULL,
  PRIMARY KEY (`Cod_Fornecedor`));
