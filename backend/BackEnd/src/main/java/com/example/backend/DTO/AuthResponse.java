package com.example.backend.DTO;

import com.example.backend.Entity.Roles;
import com.example.backend.Entity.User;

import java.util.Set;
import java.util.stream.Collectors;

public class AuthResponse {
    private boolean success;
    private String message;
    private UserDTO user;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, UserDTO user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public static class UserDTO {
        private Long id;
        private String username;
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private Boolean enabled;
        private Set<String> roles;

        public UserDTO() {
        }

        public UserDTO(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.fullName = user.getFullName();
            this.email = user.getEmail();
            this.phone = user.getPhone();
            this.address = user.getAddress();
            this.enabled = user.getEnabled();
            // Safely handle roles - check for null or empty
            // If user has no roles, assign CUSTOMER role as default
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                this.roles = user.getRoles().stream().map(Roles::getCode).collect(Collectors.toSet());
            } else {
                // Default to CUSTOMER role if no roles found
                this.roles = new java.util.HashSet<>();
                this.roles.add("CUSTOMER");
            }
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

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
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

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public Boolean getEnabled() {
            return enabled;
        }

        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }

        public Set<String> getRoles() {
            return roles;
        }

        public void setRoles(Set<String> roles) {
            this.roles = roles;
        }
    }
}

