CREATE TABLE `nota_fiscal_cliente` (
  `cod_venda` INT NOT NULL,
  `cod_produto` INT NOT NULL,
  `data` DATE NULL,
  `valor` DOUBLE NULL,
  `qtd_vendida` INT NULL,
  `cod_cliente` INT NULL,
  `cod_loja` INT NULL,
  PRIMARY KEY (`cod_venda`, `cod_produto`),
  INDEX `fk_nf_client_loja_idx` (`cod_loja` ASC) VISIBLE,
  INDEX `fk_nf_cliente_produto_idx` (`cod_produto` ASC) VISIBLE,
  INDEX `fk_nf_cliente_cliente_idx` (`cod_cliente` ASC) VISIBLE,
  CONSTRAINT `fk_nf_cliente_loja`
    FOREIGN KEY (`cod_loja`)
    REFERENCES `faculdade`.`loja` (`Cod_Loja`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_nf_cliente_produto`
    FOREIGN KEY (`cod_produto`)
    REFERENCES `faculdade`.`produto` (`Cod_Produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_nf_cliente_cliente`
    FOREIGN KEY (`cod_cliente`)
    REFERENCES `faculdade`.`cliente` (`Cod_Cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
