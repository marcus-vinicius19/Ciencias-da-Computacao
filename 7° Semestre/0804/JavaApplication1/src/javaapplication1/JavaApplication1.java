/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package javaapplication1;

/**
 *
 * @author marcus.michieleto_us
 */
public class JavaApplication1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
    int inicio = 1;
        int fim = 100000;
       
        long tempoInicio = System.currentTimeMillis();

        for (int valor = inicio; valor <= fim; valor++) {
            if (ehPrimo(valor)) {
                System.out.println(valor);
            }
        }
        long tempoFim = System.currentTimeMillis();
        System.out.printf("Tempo total: %.3f segundos\n", (tempoFim - tempoInicio) / 1000.0);
    }

    private static boolean ehPrimo(int valor) {
        for (int divisor = 2; divisor < valor; divisor++) {
            if (valor % divisor == 0) {
                return false;
            }
        }
        return true;
    }
    
}
