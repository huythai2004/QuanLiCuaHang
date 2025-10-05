package com.example.backend.Controller;

import com.example.backend.Entity.ProductImages;
import com.example.backend.Service.CloudinaryService;
import com.example.backend.Service.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/product-images")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductImagesController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ProductImagesService productImagesService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImages>> getImagesByProduct(@PathVariable Long productId) {
        List<ProductImages> images = productImagesService.findByProductId(productId);
        return ResponseEntity.ok(images);
    }

    @PostMapping("/upload/{productId}")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            
            // Save to database
            ProductImages productImage = new ProductImages();
            productImage.setProductId(productId);
            productImage.setImageUrl(imageUrl);
            
            ProductImages savedImage = productImagesService.save(productImage);
            
            response.put("success", true);
            response.put("message", "Image uploaded successfully");
            response.put("imageUrl", imageUrl);
            response.put("imageId", savedImage.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/upload-multiple/{productId}")
    public ResponseEntity<Map<String, Object>> uploadMultipleImages(
            @PathVariable Long productId,
            @RequestParam("files") MultipartFile[] files) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int successCount = 0;
            int failCount = 0;
            
            for (MultipartFile file : files) {
                try {
                    String imageUrl = cloudinaryService.uploadImage(file);
                    
                    ProductImages productImage = new ProductImages();
                    productImage.setProductId(productId);
                    productImage.setImageUrl(imageUrl);
                    
                    productImagesService.save(productImage);
                    successCount++;
                } catch (IllegalArgumentException e) {
                    failCount++;
                    // Log the error but continue with other files
                }
            }
            
            response.put("success", true);
            response.put("message", String.format("Upload completed: %d success, %d failed", successCount, failCount));
            response.put("successCount", successCount);
            response.put("failCount", failCount);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload images: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Map<String, Object>> deleteImage(@PathVariable Long imageId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ProductImages image = productImagesService.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));
            
            // Delete from Cloudinary
            String publicId = cloudinaryService.extractPublicId(image.getImageUrl());
            if (publicId != null) {
                cloudinaryService.deleteImage(publicId);
            }
            
            // Delete from database
            productImagesService.deleteById(imageId);
            
            response.put("success", true);
            response.put("message", "Image deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
