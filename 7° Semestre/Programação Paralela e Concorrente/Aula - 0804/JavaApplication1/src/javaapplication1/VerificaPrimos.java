/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package javaapplication1;

/**
 *
 * @author marcus.michieleto_us
 */
public class VerificaPrimos extends Thread {
    private int limiteInferior, limiteSuperior;

    public VerificaPrimos(int limiteInferior, int limiteSuperior) {
        this.limiteInferior = limiteInferior;
        this.limiteSuperior = limiteSuperior;
        System.out.println("ComputaPrimos(" + limiteInferior + ", " + limiteSuperior + ")");
    }

    @Override
    public void run() {
        for (int valor = limiteInferior; valor < limiteSuperior; valor++) {
            if (ehPrimo(valor)) {
                System.out.println(valor);
            }
        }
    }

    private boolean ehPrimo(int valor) {
        for (int divisor = 2; divisor < valor; divisor++) {
            if (valor % divisor == 0) {
                return false;
            }
        }
        return true;
    }
}
