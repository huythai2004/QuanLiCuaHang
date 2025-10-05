package com.example.backend.Controller;

import com.example.backend.Entity.Products;
import com.example.backend.Service.ProductsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    public ResponseEntity<Products> create(@RequestBody Products products) {
        Products saveProducts = productsService.save(products);
        return ResponseEntity.ok().body(saveProducts);
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
