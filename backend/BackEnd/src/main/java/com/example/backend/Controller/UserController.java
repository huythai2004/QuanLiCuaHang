package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

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

    // Update user roles (Admin only)
    @PutMapping("/{id}/roles")
    public ResponseEntity<?> updateUserRoles(
            @PathVariable Long id,
            @RequestBody Map<String, Set<String>> request) {
        try {
            Set<String> roles = request.get("roles");
            if (roles == null || roles.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Vai trò không được để trống"
                ));
            }
            
            User updatedUser = userService.updateUserRoles(id, roles);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Cập nhật vai trò thành công",
                    "user", updatedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Lỗi khi cập nhật vai trò: " + e.getMessage()
            ));
        }
    }
}
