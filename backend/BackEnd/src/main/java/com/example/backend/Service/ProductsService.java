package com.example.backend.Service;

import com.example.backend.Entity.Products;
import com.example.backend.Repository.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsService {
    @Autowired
    private ProductsRepository repository;

    public ProductsService(ProductsRepository repository) {
        this.repository = repository;
    }

    public List<Products> getAll() {
        return repository.findAll();
    }

    public Optional<Products> findById(Long id) {
        return repository.findById(id);
    }

    public Products save(Products products) {
        return repository.save(products);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
