package com.example.productapp.service;

import com.example.productapp.entity.Product;
import com.example.productapp.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;

    public ProductServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Override
    public Page<Product> getProducts(int page, int size) {
        return repository.findAll(org.springframework.data.domain.PageRequest.of(page, size));
    }

    @Override
    public Product saveProduct(Product product) {
        return repository.save(product);
    }

    @Override
    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return repository.findByTitleContainingIgnoreCase(keyword, pageable);
    }

    @Override
    public List<String> getCategories() {
        return repository.findDistinctCategories();
    }
} 
