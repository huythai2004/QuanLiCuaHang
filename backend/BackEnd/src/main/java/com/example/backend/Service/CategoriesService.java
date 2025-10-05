package com.example.backend.Service;

import com.example.backend.Entity.Categories;
import com.example.backend.Repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.Future;

@Service
public class CategoriesService {
    @Autowired
    private  CategoriesRepository categoriesRepository;
    public List<Categories> getAll() {
        return categoriesRepository.findAll();
    }
    public Optional <Categories> getById(Long id) {
       return categoriesRepository.findById(id);
    }
    public Categories createCategories (Categories categories) {
        return categoriesRepository.save(categories);
    }
    public String deleteCategories (Long id) {
        categoriesRepository.deleteById(id);
        return "Deleted Categories: " + id;
    }

}
