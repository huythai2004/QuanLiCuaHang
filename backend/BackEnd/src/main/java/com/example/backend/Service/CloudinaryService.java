package com.example.backend.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/png", "image/jpg", "image/jpeg"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        // Validate file
        validateImageFile(file);
        
        Map<String, Object> params = ObjectUtils.asMap(
            "folder", folder,
            "resource_type", "auto",
            "use_filename", true,
            "unique_filename", true
        );
        
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), params);
        return (String) result.get("secure_url");
    }

    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, "quanlicuahang/products");
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public String extractPublicId(String imageUrl) {
        // Extract public ID from Cloudinary URL
        // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
        if (imageUrl != null && imageUrl.contains("cloudinary.com")) {
            String[] parts = imageUrl.split("/");
            if (parts.length > 0) {
                String lastPart = parts[parts.length - 1];
                return lastPart.split("\\.")[0]; // Remove file extension
            }
        }
        return null;
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5MB limit");
        }

        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Only PNG, JPG, and JPEG files are allowed");
        }

        // Additional validation for file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("File name is null");
        }

        String extension = originalFilename.toLowerCase();
        if (!extension.endsWith(".png") && !extension.endsWith(".jpg") && !extension.endsWith(".jpeg")) {
            throw new IllegalArgumentException("File extension must be .png, .jpg, or .jpeg");
        }
    }
}
