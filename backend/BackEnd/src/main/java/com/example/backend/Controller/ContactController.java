package com.example.backend.Controller;

import com.example.backend.DTO.ContactRequest;
import com.example.backend.Service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @Value("${app.admin.email:admin@shop.com}")
    private String adminEmail;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@Valid @RequestBody ContactRequest request) {
        try {
            // Gửi email đến admin
            emailService.sendContactEmail(
                request.getEmail(),
                request.getMessage(),
                adminEmail
            );

            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "message", "Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of(
                    "success", false,
                    "message", "Lỗi khi gửi tin nhắn. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua email."
                ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of(
                    "success", false,
                    "message", "Dữ liệu không hợp lệ: " + e.getMessage()
                ));
        }
    }
}

