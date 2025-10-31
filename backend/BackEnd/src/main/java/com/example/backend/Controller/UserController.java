package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id).orElse(null);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.crateUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User user) {
        User u = userService.update(id, user);
        return ResponseEntity.ok(u);
    }

//    @PutMapping("/with-password/{id}")
//        public User updateWithPassword(@PathVariable Long id, @RequestBody User user) {
//        return  userService.updatePassword(id, user);
//        }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        userService.deleteById(id);
        return "DELETE ID: " + id;
    }
}
