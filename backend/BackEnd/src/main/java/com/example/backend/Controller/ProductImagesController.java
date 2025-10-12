package com.example.backend.Controller;

import com.example.backend.Entity.ProductImages;
import com.example.backend.Service.CloudinaryService;
import com.example.backend.Service.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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

    /**
     * Upload image from URL to Cloudinary
     * @param productId Product ID
     * @param imageUrl Image URL from web
     * @return Response with uploaded image details
     */
    @PostMapping("/upload-from-url/{productId}")
    public ResponseEntity<Map<String, Object>> uploadImageFromUrl(
            @PathVariable Long productId,
            @RequestBody Map<String, String> requestBody) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String imageUrl = requestBody.get("imageUrl");
            
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Image URL is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Download and upload to Cloudinary
            String cloudinaryUrl = cloudinaryService.uploadImageFromUrl(imageUrl);
            
            // Save to database
            ProductImages productImage = new ProductImages();
            productImage.setProductId(productId);
            productImage.setImageUrl(cloudinaryUrl);
            
            ProductImages savedImage = productImagesService.save(productImage);
            
            response.put("success", true);
            response.put("message", "Image uploaded successfully from URL");
            response.put("imageUrl", cloudinaryUrl);
            response.put("imageId", savedImage.getId());
            response.put("originalUrl", imageUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload image from URL: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Upload multiple images from URLs to Cloudinary
     * @param productId Product ID
     * @param requestBody List of image URLs
     * @return Response with upload results
     */
    @PostMapping("/upload-multiple-from-urls/{productId}")
    public ResponseEntity<Map<String, Object>> uploadMultipleImagesFromUrls(
            @PathVariable Long productId,
            @RequestBody Map<String, List<String>> requestBody) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<String> imageUrls = requestBody.get("imageUrls");
            
            if (imageUrls == null || imageUrls.isEmpty()) {
                response.put("success", false);
                response.put("message", "Image URLs list is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            int successCount = 0;
            int failCount = 0;
            List<Map<String, Object>> uploadedImages = new ArrayList<>();
            List<String> errors = new ArrayList<>();
            
            for (String imageUrl : imageUrls) {
                try {
                    if (imageUrl == null || imageUrl.trim().isEmpty()) {
                        failCount++;
                        errors.add("Empty URL skipped");
                        continue;
                    }
                    
                    // Download and upload to Cloudinary
                    String cloudinaryUrl = cloudinaryService.uploadImageFromUrl(imageUrl.trim());
                    
                    // Save to database
                    ProductImages productImage = new ProductImages();
                    productImage.setProductId(productId);
                    productImage.setImageUrl(cloudinaryUrl);
                    
                    ProductImages savedImage = productImagesService.save(productImage);
                    
                    Map<String, Object> imageInfo = new HashMap<>();
                    imageInfo.put("imageId", savedImage.getId());
                    imageInfo.put("cloudinaryUrl", cloudinaryUrl);
                    imageInfo.put("originalUrl", imageUrl);
                    uploadedImages.add(imageInfo);
                    
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    errors.add(imageUrl + ": " + e.getMessage());
                }
            }
            
            response.put("success", true);
            response.put("message", String.format("Upload completed: %d success, %d failed", successCount, failCount));
            response.put("successCount", successCount);
            response.put("failCount", failCount);
            response.put("uploadedImages", uploadedImages);
            
            if (!errors.isEmpty()) {
                response.put("errors", errors);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload images from URLs: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Update/Replace image with new URL
     * @param imageId Image ID to update
     * @param requestBody New image URL
     * @return Response with updated image details
     */
    @PutMapping("/update-from-url/{imageId}")
    public ResponseEntity<Map<String, Object>> updateImageFromUrl(
            @PathVariable Long imageId,
            @RequestBody Map<String, String> requestBody) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String newImageUrl = requestBody.get("imageUrl");
            
            if (newImageUrl == null || newImageUrl.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "New image URL is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Find existing image
            ProductImages existingImage = productImagesService.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageId));
            
            String oldCloudinaryUrl = existingImage.getImageUrl();
            
            // Upload new image to Cloudinary
            String newCloudinaryUrl = cloudinaryService.uploadImageFromUrl(newImageUrl);
            
            // Delete old image from Cloudinary (optional, to save storage)
            try {
                String oldPublicId = cloudinaryService.extractPublicId(oldCloudinaryUrl);
                if (oldPublicId != null) {
                    cloudinaryService.deleteImage(oldPublicId);
                }
            } catch (Exception e) {
                // Log but don't fail the update if old image deletion fails
                System.err.println("Warning: Failed to delete old image from Cloudinary: " + e.getMessage());
            }
            
            // Update database with new URL
            existingImage.setImageUrl(newCloudinaryUrl);
            ProductImages updatedImage = productImagesService.save(existingImage);
            
            response.put("success", true);
            response.put("message", "Image updated successfully");
            response.put("imageId", updatedImage.getId());
            response.put("oldImageUrl", oldCloudinaryUrl);
            response.put("newImageUrl", newCloudinaryUrl);
            response.put("originalUrl", newImageUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update image: " + e.getMessage());
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
