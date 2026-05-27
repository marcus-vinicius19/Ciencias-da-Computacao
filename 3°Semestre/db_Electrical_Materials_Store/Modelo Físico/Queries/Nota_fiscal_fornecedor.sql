CREATE TABLE `nota_fiscal_fornecedor` (
  `cod_compra` INT NOT NULL,
  `cod_produto` INT NOT NULL,
  `data` DATE NULL,
  `valor` DOUBLE NULL,
  `qtd_comprada` INT NULL,
  `cod_loja` INT NULL,
  `cod_fornecedor` INT NULL,
  PRIMARY KEY (`cod_compra`, `cod_produto`),
  INDEX `fk_nf_fornecedor_produto_idx` (`cod_produto` ASC) VISIBLE,
  INDEX `fk_nf_fornecedor_loja_idx` (`cod_loja` ASC) VISIBLE,
  INDEX `fk_nf_fornecedor_fornecedor_idx` (`cod_fornecedor` ASC) VISIBLE,
  CONSTRAINT `fk_nf_fornecedor_produto`
    FOREIGN KEY (`cod_produto`)
    REFERENCES `faculdade`.`produto` (`Cod_Produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_nf_fornecedor_loja`
    FOREIGN KEY (`cod_loja`)
    REFERENCES `faculdade`.`loja` (`Cod_Loja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_nf_fornecedor_fornecedor`
    FOREIGN KEY (`cod_fornecedor`)
    REFERENCES `faculdade`.`fornecedor` (`Cod_Fornecedor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
