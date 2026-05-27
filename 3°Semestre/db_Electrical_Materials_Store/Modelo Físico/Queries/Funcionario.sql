CREATE TABLE `funcionario` (
  `Cod_Funcionario` INT NOT NULL,
  `CPF` VARCHAR(11) NULL,
  `Nome` VARCHAR(45) NULL,
  `Cod_Cargo` INT NULL,
  `Cod_Loja` INT NULL,
  PRIMARY KEY (`Cod_Funcionario`),
  INDEX `Cod_Cargo_idx` (`Cod_Cargo` ASC) VISIBLE,
  INDEX `Cod_Loja_idx` (`Cod_Loja` ASC) VISIBLE,
  CONSTRAINT `Cod_Cargo`
    FOREIGN KEY (`Cod_Cargo`)
    REFERENCES `faculdade`.`cargo` (`Cod_Cargo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `Cod_Loja`
    FOREIGN KEY (`Cod_Loja`)
    REFERENCES `faculdade`.`loja` (`Cod_Loja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
