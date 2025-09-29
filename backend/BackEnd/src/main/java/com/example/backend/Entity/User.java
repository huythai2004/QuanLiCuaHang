package com.example.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(name = "email", unique = true, nullable = false, length = 120)
    private String email;
    
    @Column(name = "phone", length = 30)
    private String phone;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Column(name = "enabled", nullable = false)
    private Boolean enabled;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public User() {
    }

    public User(Long id, String username, String email, String phone, String passwordHash, 
                Boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
