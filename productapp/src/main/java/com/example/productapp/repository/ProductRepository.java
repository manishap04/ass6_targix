package com.example.productapp.repository;

import com.example.productapp.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByTitleContainingIgnoreCase(String keyword);

    Page<Product> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

    List<Product> findByCreatedDateBetween(String start, String end);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategories();
}  
