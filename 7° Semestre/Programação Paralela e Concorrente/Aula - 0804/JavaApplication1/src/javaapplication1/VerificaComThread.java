/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package javaapplication1;

/**
 *
 * @author marcus.michieleto_us
 */
public class VerificaComThread {
    public static void main(String[] args) throws InterruptedException {
    int inicio = 1;
        int fim = 100000;

        long tempoInicio = System.currentTimeMillis(); 

        VerificaPrimos thread1 = new VerificaPrimos(inicio, fim / 2);
        thread1.start();
        thread1.join();

        VerificaPrimos thread2 = new VerificaPrimos((fim / 2) + 1, fim);
        thread2.start();
        thread2.join();
       
        long tempoFim = System.currentTimeMillis();

        System.out.println("Tempo total em milissegundos: " + (tempoFim - tempoInicio));
}
}