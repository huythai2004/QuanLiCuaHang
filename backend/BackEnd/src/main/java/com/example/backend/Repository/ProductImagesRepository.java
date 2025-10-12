package com.example.backend.Repository;

import com.example.backend.Entity.ProductImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImagesRepository extends JpaRepository<ProductImages, Long> {
    List<ProductImages> findByProductId(Long productId);
    void deleteByProductId(Long productId);
}
