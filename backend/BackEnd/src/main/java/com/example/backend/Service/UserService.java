package com.example.backend.Service;

import com.example.backend.DTO.RegisterRequest;
import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public User crateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteById (Long id) {
        userRepository.deleteById(id);
    }

    public User update (Long id, User user) {
        return  userRepository.findById(id).map(u -> {
            u.setUsername(user.getUsername());
            u.setFullName(user.getFullName());
            u.setPasswordHash(user.getPasswordHash());
            u.setEmail(user.getEmail());
            u.setPhone(user.getPhone());
            u.setEnabled(user.getEnabled());
            return userRepository.save(u);
        }).orElse(null);
    }

    // Register new user
    public User register(RegisterRequest request) throws Exception {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new Exception("Tên đăng nhập đã tồn tại!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email đã được sử dụng!");
        }

        // Check if phone already exists
        if (request.getPhone() != null && !request.getPhone().isEmpty() 
            && userRepository.existsByPhone(request.getPhone())) {
            throw new Exception("Số điện thoại đã được sử dụng!");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(request.getPassword());
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // Login user
    public Optional<User> login(String emailOrPhone, String password) {
        Optional<User> user = Optional.empty();

        // Try to find by email
        user = userRepository.findByEmail(emailOrPhone);

        // If not found by email, try by phone
        if (user.isEmpty()) {
            user = userRepository.findByPhone(emailOrPhone);
        }

        // Check if user exists and password matches
        if (user.isPresent() && user.get().getPasswordHash().equals(password)) {
            return user;
        }

        return Optional.empty();
    }
}
