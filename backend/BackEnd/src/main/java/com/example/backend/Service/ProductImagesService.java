package com.example.backend.Service;

import com.example.backend.Entity.ProductImages;
import com.example.backend.Repository.ProductImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductImagesService {

    @Autowired
    private ProductImagesRepository productImagesRepository;

    public List<ProductImages> getAll() {
        return productImagesRepository.findAll();
    }

    public Optional<ProductImages> findById(Long id) {
        return productImagesRepository.findById(id);
    }

    public List<ProductImages> findByProductId(Long productId) {
        return productImagesRepository.findByProductId(productId);
    }

    public ProductImages save(ProductImages productImage) {
        return productImagesRepository.save(productImage);
    }

    public void deleteById(Long id) {
        productImagesRepository.deleteById(id);
    }

    public void deleteByProductId(Long productId) {
        productImagesRepository.deleteByProductId(productId);
    }
}
