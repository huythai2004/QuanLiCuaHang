package com.example.backend.Controller;

import com.example.backend.Service.PasswordOtpCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")

public class PasswordResetController {
    private final PasswordOtpCodeService passwordOtpCodeService;
    public PasswordResetController(PasswordOtpCodeService passwordOtpCodeService) {
        this.passwordOtpCodeService = passwordOtpCodeService;
    }

    //Send OTP code to email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        passwordOtpCodeService.sendOtpCode(email);
        return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn.");
    }

    //Reset password using OTP code
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email,
                                           @RequestParam String otp,
                                           @RequestParam String newPassword) {
        passwordOtpCodeService.resetPassword(email, otp, newPassword);
        return ResponseEntity.ok("Mật khẩu của bạn đã được đặt lại thành công.");
    }
}
