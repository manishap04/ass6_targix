package com.example.productapp.controller;

import com.example.productapp.entity.Product;
import com.example.productapp.service.ProductService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // 1️⃣ Get all products (paged)
    @GetMapping
    public org.springframework.data.domain.Page<Product> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getProducts(page, size);
    }

    // 2️⃣ Search products (paged)
    @GetMapping("/search")
    public org.springframework.data.domain.Page<Product> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.searchProducts(keyword, PageRequest.of(page, size));
    }

    // categories
    @GetMapping("/categories")
    public java.util.List<String> categories() {
        return service.getCategories();
    }

    // 3️⃣ Create product (POST)
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return service.saveProduct(product);
    }
}
