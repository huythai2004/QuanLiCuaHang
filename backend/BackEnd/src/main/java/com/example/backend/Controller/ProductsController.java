package com.example.backend.Controller;

import com.example.backend.DTO.CreateProductWithImagesRequest;
import com.example.backend.Entity.Products;
import com.example.backend.Service.ProductsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductsController {
    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping
    public List<Products> getAll() {
       return productsService.getAll();

    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> getById(@PathVariable Long id) {
        return productsService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new product (Not allow images)
     * To add images, use endpoint /product-images/upload-multiple-from-urls/{productId}
     */
    @PostMapping
    public ResponseEntity<Products> create(@RequestBody Products products) {
        Products saveProducts = productsService.save(products);
        return ResponseEntity.ok().body(saveProducts);
    }

    /**
     * create new product with upload images from URLs to Cloudinary
     * Body: {
     *   "sku": "...",
     *   "name": "...",
     *   ...
     *   "imageUrls": ["url1", "url2", ...]
     * }
     */
    @PostMapping("/with-images")
    public ResponseEntity<Map<String, Object>> createWithImages(@RequestBody CreateProductWithImagesRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Products savedProduct = productsService.createProductWithImages(request);
            
            response.put("success", true);
            response.put("message", "Product created successfully with images");
            response.put("product", savedProduct);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Products> update(@PathVariable Long id, @RequestBody Products products) {
        return productsService.findById(id).map(existing -> {
            existing.setSku(products.getSku());
            existing.setName(products.getName());
            existing.setDescription(products.getDescription());
            existing.setCategoryId(products.getCategoryId());
            existing.setPrice(products.getPrice());
            existing.setStockQty(products.getStockQty());
            existing.setIsActive(products.getIsActive());
            existing.setCreatedAt(products.getCreatedAt());
            Products updateProducts = productsService.save(existing);
            return ResponseEntity.ok(updateProducts);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public String delete (@PathVariable Long id) {
        productsService.deleteById(id);
        return  "Product deleted " + id;
    }
}
