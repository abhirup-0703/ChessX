package com.chessx.logic;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChessLogicApplication {

    public static void main(String[] args) {
        // 1. Configure and load .env file
        // .ignoreIfMissing() ensures the app still runs in environments (like AWS/Heroku) 
        // where variables are set via the platform dashboard instead of a file.
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // 2. Map .env entries to System properties so Spring can find them
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });

        // 3. Run the Spring application
        SpringApplication.run(ChessLogicApplication.class, args);
    }

}