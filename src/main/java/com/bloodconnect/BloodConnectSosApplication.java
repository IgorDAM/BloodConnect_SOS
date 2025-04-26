package com.bloodconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// En BloodConnectSosApplication.java
@SpringBootApplication
public class BloodConnectSosApplication implements CommandLineRunner {

    @Autowired
    private DonorRepository donorRepo;

    public static void main(String[] args) {
        SpringApplication.run(BloodConnectSosApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("Donantes registrados: " + donorRepo.count());
    }
}