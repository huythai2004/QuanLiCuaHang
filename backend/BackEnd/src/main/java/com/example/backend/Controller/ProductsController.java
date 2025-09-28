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
    private final ProductsService prooductsService;
    private final ProductsService productsService;

    public ProductsController(ProductsService service, ProductsService productsService) {
        this.prooductsService = service;
        this.productsService = productsService;
    }

    @GetMapping
    public List<Products> getAll() {
        return prooductsService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> getById(@PathVariable Integer id) {
        return prooductsService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Products> create(@RequestBody Products products) {
        Products saveProducts = prooductsService.save(products);
        return ResponseEntity.ok().body(saveProducts);
    }

    //TODO: hoàn thành task thêm data. Sửa lại database
    @PutMapping("/{id}")
    public ResponseEntity<Products> update(@PathVariable Integer id, @RequestBody Products products) {
        return productsService.findById(id).map(p -> {

            Products updateProducts = prooductsService.save(products);
            return ResponseEntity.ok(updateProducts);
        }).orElse(ResponseEntity.notFound().build());
    }
}
