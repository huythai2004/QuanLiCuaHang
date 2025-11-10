package com.example.backend.Controller;

import com.example.backend.DTO.ContactMessageRequest;
import com.example.backend.Entity.ContactMessage;
import com.example.backend.Entity.User;
import com.example.backend.Service.ContactMessageService;
import com.example.backend.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contact")
@CrossOrigin("http://localhost:3000")
public class ContactMessageController {
    private final ContactMessageService contactMessageService;
    private final UserService userService;

    public ContactMessageController(ContactMessageService contactMessageService, UserService userService) {
        this.contactMessageService = contactMessageService;
        this.userService = userService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody ContactMessageRequest request) {
        try {
            User currentUser = null;
            if (request.getUserId() != null) {
                currentUser = userService.getById(request.getUserId()).orElse(null);
            }
            
            contactMessageService.sendContactMail(
                request.getFullName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage(),
                currentUser
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tin nhắn đã được gửi thành công!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Lỗi khi gửi tin nhắn: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllContactMessages());
    }

    @PutMapping("/mark-read/{id}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        contactMessageService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
