package com.example.productapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProductappApplication {

	public static void main(String[] args) {
		// Load .env values for local development, but do NOT override OS environment variables or existing system properties
		io.github.cdimascio.dotenv.Dotenv dotenv = io.github.cdimascio.dotenv.Dotenv.configure()
			.filename(".env")
			.ignoreIfMalformed()
			.ignoreIfMissing()
			.load();

		setIfMissing("DB_URL", dotenv.get("DB_URL"));
		setIfMissing("DB_USERNAME", dotenv.get("DB_USERNAME"));
		setIfMissing("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		setIfMissing("SERVER_PORT", dotenv.get("SERVER_PORT"));

		SpringApplication.run(ProductappApplication.class, args);
	}

	private static void setIfMissing(String key, String value) {
		if (value == null) return;
		// Respect existing environment variables and system properties
		if (System.getenv(key) == null && System.getProperty(key) == null) {
			System.setProperty(key, value);
		}
	}

}
