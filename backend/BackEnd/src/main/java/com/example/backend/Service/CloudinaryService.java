package com.example.backend.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
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

    @SuppressWarnings("unchecked")
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        // Validate file
        validateImageFile(file);
        
        Map<String, Object> params = ObjectUtils.asMap(
            "folder", folder,
            "resource_type", "auto",
            "use_filename", true,
            "unique_filename", true
        );
        
        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), params);
        return (String) result.get("secure_url");
    }

    public String uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, "quanlicuahang/products");
    }

    /**
     * Upload image from URL to Cloudinary
     * @param imageUrl URL of the image to upload
     * @return Cloudinary secure URL of the uploaded image
     * @throws IOException if download or upload fails
     */
    public String uploadImageFromUrl(String imageUrl) throws IOException {
        return uploadImageFromUrl(imageUrl, "quanlicuahang/products");
    }

    /**
     * Upload image from URL to Cloudinary with custom folder
     * @param imageUrl URL of the image to upload
     * @param folder Cloudinary folder path
     * @return Cloudinary secure URL of the uploaded image
     * @throws IOException if download or upload fails
     */
    @SuppressWarnings("unchecked")
    public String uploadImageFromUrl(String imageUrl, String folder) throws IOException {
        // Validate URL
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL cannot be empty");
        }

        // Download image from URL
        byte[] imageBytes = downloadImageFromUrl(imageUrl);
        
        // Validate downloaded image
        if (imageBytes.length > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Downloaded image size exceeds 5MB limit");
        }

        // Upload to Cloudinary
        Map<String, Object> params = ObjectUtils.asMap(
            "folder", folder,
            "resource_type", "auto",
            "use_filename", false,
            "unique_filename", true
        );
        
        @SuppressWarnings("unchecked")
        Map<String, Object> result = (Map<String, Object>) cloudinary.uploader().upload(imageBytes, params);
        return (String) result.get("secure_url");
    }

    /**
     * Download image from URL
     * @param imageUrl URL of the image
     * @return byte array of the image
     * @throws IOException if download fails
     */
    private byte[] downloadImageFromUrl(String imageUrl) throws IOException {
        URL url;
        try {
            url = new URI(imageUrl).toURL();
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Invalid URL format: " + imageUrl, e);
        }
        HttpURLConnection connection = null;
        
        try {
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(10000); // 10 seconds timeout
            connection.setReadTimeout(10000); // 10 seconds timeout
            
            // Set User-Agent to avoid being blocked by some websites
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            
            int responseCode = connection.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                throw new IOException("Failed to download image: HTTP " + responseCode);
            }
            
            // Check content type
            String contentType = connection.getContentType();
            if (contentType != null && !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("URL does not point to an image file. Content-Type: " + contentType);
            }
            
            // Read image bytes
            try (InputStream inputStream = connection.getInputStream();
                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                
                byte[] buffer = new byte[4096];
                int bytesRead;
                int totalBytes = 0;
                
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    totalBytes += bytesRead;
                    if (totalBytes > MAX_FILE_SIZE) {
                        throw new IllegalArgumentException("Image size exceeds 5MB limit");
                    }
                    outputStream.write(buffer, 0, bytesRead);
                }
                
                return outputStream.toByteArray();
            }
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
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
