package com.example.productapp.service;

import com.example.productapp.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();
    Page<Product> getProducts(int page, int size);
    Product saveProduct(Product product);

    /**
     * Paged search. Prefer this for scalability.
     */
    Page<Product> searchProducts(String keyword, Pageable pageable);

    /**
     * Convenience method to get all matches as a List (uses unpaged under the hood).
     * Use carefully for small result sets only.
     */
    default List<Product> searchProducts(String keyword) {
        return searchProducts(keyword, Pageable.unpaged()).getContent();
    }

    List<String> getCategories();
}  
