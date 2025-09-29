package com.example.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false)
    private Long productId;
    
    @Column(name = "image_url", nullable = false, length = 255)
    private String imageUrl;

    public ProductImages() {
    }

    public ProductImages(Long id, Long productId, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

