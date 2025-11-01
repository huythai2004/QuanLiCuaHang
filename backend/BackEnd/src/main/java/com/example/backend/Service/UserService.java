package com.example.backend.Service;

import com.example.backend.DTO.RegisterRequest;
import com.example.backend.Entity.Roles;
import com.example.backend.Entity.User;
import com.example.backend.Repository.CustomersRepository;
import com.example.backend.Repository.RoleRepository;
import com.example.backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomersRepository customersRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public User crateUser(User user) {
        // If password is not set, set a default password
        if (user.getpassword() == null || user.getpassword().isEmpty()) {
            user.setpassword(passwordEncoder.encode("12345678")); // Default password
        } else {
            // If password is provided, encode it
            user.setpassword(passwordEncoder.encode(user.getpassword()));
        }

        // Set default values if not provided
        if (user.getEnabled() == null) {
            user.setEnabled(true);
        }
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }

        // Add default CUSTOMER role if no roles
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Roles customerRole = roleRepository.findByCode("CUSTOMER").orElseThrow(() -> new RuntimeException("Customer Role not found"));
            user.getRoles().add(customerRole);
        }

        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    //Update User
    @Transactional
    public User update(Long id, User user) {
        return userRepository.findById(id).map(u -> {
            u.setUsername(user.getUsername());
            u.setFullName(user.getFullName());
            u.setAddress(user.getAddress());
            u.setEmail(user.getEmail());
            u.setPhone(user.getPhone());
            u.setEnabled(user.getEnabled());

            // update password
            if (user.getpassword() != null && !user.getpassword().isEmpty()) {
                u.setpassword(passwordEncoder.encode(user.getpassword()));
            }

            // Save User trước
            User savedUser = userRepository.save(u);

            // syncs information to table Customer
            customersRepository.findByUserId(id).ifPresent(customer -> {
                customer.setFullName(user.getFullName());
                customer.setAddress(user.getAddress());
                customersRepository.save(customer);
            });

            return savedUser;
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Register new user
    public User register(RegisterRequest request) throws Exception {
        String encodePassword = passwordEncoder.encode(request.getPassword());

        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new Exception("Tên đăng nhập đã tồn tại!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email đã được sử dụng!");
        }

        // Check if phone already exists
        if (request.getPhone() != null && !request.getPhone().isEmpty() && userRepository.existsByPhone(request.getPhone())) {
            throw new Exception("Số điện thoại đã được sử dụng!");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(""); // Initialize với empty string
        user.setpassword(encodePassword); // Encoding password
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());

        // Get role default
        Roles customerRoles = roleRepository.findByCode("CUSTOMER").orElseThrow(() -> new Exception("Customer Role not found"));
        user.getRoles().add(customerRoles);

        return userRepository.save(user);
    }

    // Login user
    public Optional<User> login(String emailOrPhone, String password) {
        Optional<User> user = Optional.empty();

        // Try to find by email
        user = userRepository.findByEmail(emailOrPhone);
        System.out.println("Login attempt - Email/Phone: " + emailOrPhone);
        System.out.println("Found by email: " + user.isPresent());

        // If not found by email, try by phone
        if (user.isEmpty()) {
            user = userRepository.findByPhone(emailOrPhone);
            System.out.println("Found by phone: " + user.isPresent());
        }

        // Check if user exists, is enabled, and password matches with encoder
        if (user.isPresent()) {
            User foundUser = user.get();
            System.out.println("User found - ID: " + foundUser.getId() + ", Email: " + foundUser.getEmail());
            System.out.println("User enabled: " + foundUser.getEnabled());
            System.out.println("User roles count: " + (foundUser.getRoles() != null ? foundUser.getRoles().size() : 0));

            // Check if user is enabled
            if (foundUser.getEnabled() == null || !foundUser.getEnabled()) {
                System.out.println("Login failed: User is not enabled");
                return Optional.empty();
            }

            // Check if password matches
            String storedPassword = foundUser.getpassword();
            System.out.println("Stored password hash: " + (storedPassword != null ? storedPassword.substring(0, Math.min(20, storedPassword.length())) + "..." : "null"));
            boolean isMatch = passwordEncoder.matches(password, storedPassword);
            System.out.println("Password match: " + isMatch);

            if (isMatch) {
                System.out.println("Login successful for user: " + foundUser.getEmail());
                return user;
            } else {
                System.out.println("Login failed: Password does not match");
            }
        } else {
            System.out.println("Login failed: User not found");
        }

        return Optional.empty();
    }

    // Update user roles (Admin only)
    @Transactional
    public User updateUserRoles(Long userId, Set<String> roleCodes) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Clear existing roles
        user.getRoles().clear();

        // Add new roles
        for (String roleCode : roleCodes) {
            Roles role = roleRepository.findByCode(roleCode).orElseThrow(() -> new RuntimeException("Role not found: " + roleCode));
            user.getRoles().add(role);
        }

        return userRepository.save(user);
    }
}
