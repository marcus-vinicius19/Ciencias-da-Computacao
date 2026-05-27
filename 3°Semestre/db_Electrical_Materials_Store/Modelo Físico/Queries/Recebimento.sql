CREATE TABLE `recebimento` (
  `cod_compra` INT NOT NULL,
  `cod_produto` INT NOT NULL,
  `cod_estoque` INT NOT NULL,
  `cod_loja` INT NOT NULL,
  PRIMARY KEY (`cod_compra`, `cod_produto`),
  INDEX `fk_recebimento_loja_idx` (`cod_loja` ASC) VISIBLE,
  INDEX `fk_recebimento_estoque_idx` (`cod_estoque` ASC) VISIBLE,
  CONSTRAINT `fk_recebimento_nf_fornecedor`
    FOREIGN KEY (`cod_compra` , `cod_produto`)
    REFERENCES `faculdade`.`nota_fiscal_fornecedor` (`cod_compra` , `cod_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recebimento_loja`
    FOREIGN KEY (`cod_loja`)
    REFERENCES `faculdade`.`loja` (`Cod_Loja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recebimento_estoque`
    FOREIGN KEY (`cod_estoque`)
    REFERENCES `faculdade`.`estoque` (`cod_estoque`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
