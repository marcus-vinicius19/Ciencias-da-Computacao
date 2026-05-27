CREATE TABLE `estoque` (
  `cod_estoque` INT NOT NULL,
  `cod_produto` INT NOT NULL,
  `qtd_produto` INT NULL,
  `cod_loja` INT NULL,
  PRIMARY KEY (`cod_estoque`, `cod_produto`),
  INDEX `fk_estoque_loja_idx` (`cod_loja` ASC) VISIBLE,
  INDEX `fk_estoque_produto_idx` (`cod_produto` ASC) VISIBLE,
  CONSTRAINT `fk_estoque_loja`
    FOREIGN KEY (`cod_loja`)
    REFERENCES `faculdade`.`loja` (`Cod_Loja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_estoque_produto`
    FOREIGN KEY (`cod_produto`)
    REFERENCES `faculdade`.`produto` (`Cod_Produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
