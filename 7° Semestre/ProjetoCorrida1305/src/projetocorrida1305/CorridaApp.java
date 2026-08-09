/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package projetocorrida1305;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.util.Random;
import static javax.swing.WindowConstants.EXIT_ON_CLOSE;

public class CorridaApp extends JFrame {
    
    private JButton btnIniciar;
    private JButton btnResetar;
    private JProgressBar barra1;
    private JProgressBar barra2;
    private JProgressBar barra3;
    private JLabel resultado;
    
    private boolean corridaAtiva = false;
    
    public CorridaApp() {
        setTitle("Corrida com Threads");
        setSize(400, 250);
        setLayout(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        
        btnIniciar = new JButton("Iniciar Corrida");
        btnResetar = new JButton("Resetar");
        barra1 = new JProgressBar(0, 100);
        barra2 = new JProgressBar(0, 100);
        barra3 = new JProgressBar(0, 100);
        resultado = new JLabel("Aguardando início da corrida...");
        
        btnIniciar.setBounds(30, 20, 150, 30);
        btnResetar.setBounds(200, 20, 150, 30);
        barra1.setBounds(30, 70, 320, 25);
        barra2.setBounds(30, 110, 320, 25);
        barra3.setBounds(30, 150, 320, 25);
        resultado.setBounds(30, 160, 320, 30);
        
        add(btnIniciar);
        add(btnResetar);
        add(barra1);
        add(barra2);
        add(barra3);
        add(resultado);
        
        btnIniciar.addActionListener((ActionEvent e) -> iniciarCorrida());
        btnResetar.addActionListener((ActionEvent e) -> resetarCorrida());
    }
    
    private void iniciarCorrida() {
        if (corridaAtiva) return;
        
        corridaAtiva = true;
        resultado.setText("Corrida em andamento...");
        
        new Thread(() -> correr(barra1, "Corredor 1")).start();
        new Thread(() -> correr(barra2, "Corredor 2")).start();
        new Thread(() -> correr(barra3, "Corredor 3")).start();
    }
    
    private void correr(JProgressBar barra, String nome) {
        Random rand = new Random();
        int progresso = 0;
        
        while (progresso < 100 && corridaAtiva) {
            try {
                Thread.sleep(rand.nextInt(150) + 50);
                progresso += rand.nextInt(5) + 1;
                
                final int valorAtual = Math.min(progresso, 100);
                SwingUtilities.invokeLater(() -> barra.setValue(valorAtual));
                
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        verificarVencedor();
    }
    
    private synchronized void verificarVencedor() {
        if (!corridaAtiva) return;
        
        if (barra1.getValue() >= 100 && barra2.getValue() >= 100 && barra3.getValue() >= 100) {
            resultado.setText("Empate");
        } else if (barra1.getValue() >= 100) {
            resultado.setText("Corredor 1 venceu!");
        } else if (barra2.getValue() >= 100) {
            resultado.setText("Corredor 2 venceu!");
        } else if (barra3.getValue() >= 100) {
            resultado.setText("Corredor 3 venceu!");
        } else {
            return;
        }
        
        corridaAtiva = false;
    }
    
    private void resetarCorrida() {
        corridaAtiva = false;
        barra1.setValue(0);
        barra2.setValue(0);
        barra3.setValue(0);
        resultado.setText("Corrida resetada. Pronto para começar!");
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new CorridaApp() .setVisible(true));
    }
}
