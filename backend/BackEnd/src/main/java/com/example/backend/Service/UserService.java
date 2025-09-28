package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(String id) {
        return userRepository.findById(id);
    }

    public User crateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteById (String id) {
        userRepository.deleteById(id);
    }

    public User update (String id, User user) {
        return  userRepository.findById(id).map(u -> {
            u.setUsername(user.getUsername());
            u.setPassword_hash(user.getPassword_hash());
            u.setEmail(user.getEmail());
            u.setEnabled(user.isEnabled());
            return userRepository.save(u);
        }).orElse(null);
    }
}
