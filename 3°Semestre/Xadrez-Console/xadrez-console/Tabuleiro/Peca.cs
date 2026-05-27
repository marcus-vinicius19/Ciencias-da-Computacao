

namespace tabuleiro
{
    abstract  class Peca
    {
        public Posicao posicao { get; set; }   
        public Cor cor { get; set; }

        public int qtdMovimentos { get; protected set; }

        public Tabuleiro tab { get; protected set; }    



        public Peca (Cor cor, Tabuleiro tab)
        {
            this.tab  = tab;
            this.posicao = null;
            this.cor = cor;
            this.qtdMovimentos = 0;
        }

        public Peca(Tabuleiro tab, Cor cor)
        {
            this.tab = tab;
            this.cor = cor;
        }

        public void incrementarQteMovimentos()
        {
            qtdMovimentos++;
        }

        public void decrementarQteMovimentos()
        {
            qtdMovimentos--;
        }
        public bool existeMovimentosPossiveis()
        {
            bool[,] mat = movimentosPossiveis();
            for(int i = 0; i<tab.linhas; i++)
            {
                for(int j=0; j<tab.linhas; j++)
                {
                    if (mat[i, j])
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool movimentoPossível(Posicao pos)
        {
            return movimentosPossiveis()[pos.linha, pos.coluna];
        }
        public abstract bool[,] movimentosPossiveis();
    }
}
