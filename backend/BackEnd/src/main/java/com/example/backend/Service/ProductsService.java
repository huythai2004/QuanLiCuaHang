package com.example.backend.Service;

import com.example.backend.DTO.CreateProductWithImagesRequest;
import com.example.backend.Entity.ProductImages;
import com.example.backend.Entity.Products;
import com.example.backend.Repository.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductsService {
    @Autowired
    private ProductsRepository repository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ProductImagesService productImagesService;

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

    /**
     * create new product with upload images from URLs to Cloudinary
     */
    @Transactional
    public Products createProductWithImages(CreateProductWithImagesRequest request) {
        try {
            // Create product
            Products product = new Products();
            product.setSku(request.getSku());
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setCategoryId(request.getCategoryId());
            product.setPrice(request.getPrice());
            product.setStockQty(request.getStockQty());
            product.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
            product.setCreatedAt(LocalDateTime.now());

            // Save product
            Products savedProduct = repository.save(product);

            // Upload images to Cloudinary and save to database
            if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
                for (String imageUrl : request.getImageUrls()) {
                    try {
                        // Download and upload to Cloudinary
                        String cloudinaryUrl = cloudinaryService.uploadImageFromUrl(imageUrl);

                        // save to database
                        ProductImages productImage = new ProductImages();
                        productImage.setProductId(savedProduct.getId());
                        productImage.setImageUrl(cloudinaryUrl);
                        productImagesService.save(productImage);
                    } catch (Exception e) {
                        // Log error but still continue with other images
                        System.err.println("Failed to upload image: " + imageUrl + " - " + e.getMessage());
                    }
                }
            }

            // Reload product to get images
            return repository.findById(savedProduct.getId()).orElse(savedProduct);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create product with images: " + e.getMessage(), e);
        }
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
