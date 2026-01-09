package com.example.productapp.config;

import com.example.productapp.entity.Product;
import com.example.productapp.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(ProductRepository repo) {
        return args -> {
            if (repo.count()==0)
{            LocalDate today = LocalDate.now();
            // create sample products dated within the last week
            repo.save(new Product(null, "iPhone 15", "Apple phone", 79999.0, "Mobile", "Apple", today.minusDays(6).toString()));
            repo.save(new Product(null, "Samsung TV", "Smart TV", 45999.0, "Electronics", "Samsung", today.minusDays(3).toString()));
            repo.save(new Product(null, "HP Laptop", "Gaming laptop", 68999.0, "Laptop", "HP", today.minusDays(1).toString()));
}
        };
    }
} 
