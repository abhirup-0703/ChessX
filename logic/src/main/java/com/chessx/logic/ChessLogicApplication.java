package com.chessx.logic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class ChessLogicApplication {
    public static void main(String[] args) {
        SpringApplication.run(ChessLogicApplication.class, args);
    }
}