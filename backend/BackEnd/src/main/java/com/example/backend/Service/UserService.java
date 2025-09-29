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
            u.setPasswordHash(user.getPasswordHash());
            u.setEmail(user.getEmail());
            u.setEnabled(user.getEnabled());
            return userRepository.save(u);
        }).orElse(null);
    }
}
