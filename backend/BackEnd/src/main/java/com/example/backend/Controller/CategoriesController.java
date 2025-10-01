package com.example.backend.Controller;

import com.example.backend.Entity.Categories;
import com.example.backend.Service.CategoriesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoriesController {
    private final CategoriesService categoriesService;
    public  CategoriesController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }
    @GetMapping
    public List<Categories> getAll() {
        return categoriesService.getAll();
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Categories> getById(@PathVariable Long id) {
        return categoriesService.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
