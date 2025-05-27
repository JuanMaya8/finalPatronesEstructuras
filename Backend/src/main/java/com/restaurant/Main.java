package com.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        System.out.println("Iniciando Sistema de Gestión de Restaurante");
        SpringApplication.run(Main.class, args);
        System.out.println("Sistema iniciado correctamente en http://localhost:8080");
    }
}
