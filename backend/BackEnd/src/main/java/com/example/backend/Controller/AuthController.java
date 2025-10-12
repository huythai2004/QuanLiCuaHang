package com.example.backend.Controller;

import com.example.backend.DTO.AuthResponse;
import com.example.backend.DTO.LoginRequest;
import com.example.backend.DTO.RegisterRequest;
import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Tên đăng nhập không được để trống!", null));
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email không được để trống!", null));
            }

            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Mật khẩu phải có ít nhất 6 ký tự!", null));
            }

            // Register user
            User user = userService.register(request);
            AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(user);

            return ResponseEntity.ok(
                new AuthResponse(true, "Đăng ký thành công!", userDTO)
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new AuthResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            // Validate input
            if (request.getEmailOrPhone() == null || request.getEmailOrPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email/Số điện thoại không được để trống!", null));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Mật khẩu không được để trống!", null));
            }

            // Attempt login
            Optional<User> userOpt = userService.login(request.getEmailOrPhone(), request.getPassword());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(user);

                return ResponseEntity.ok(
                    new AuthResponse(true, "Đăng nhập thành công!", userDTO)
                );
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, 
                        "Bạn đã điền sai email/số điện thoại hoặc mật khẩu, vui lòng nhập lại!", 
                        null));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(false, "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<AuthResponse> checkAuth() {
        return ResponseEntity.ok(
            new AuthResponse(true, "Auth endpoint is working", null)
        );
    }
}

