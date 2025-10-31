package com.example.backend.Controller;

import com.example.backend.DTO.ResetPasswordRequest;
import com.example.backend.Service.PasswordOtpCodeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

    // Send OTP code to email (support both email and phone)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String emailOrPhone) {
        try {
            passwordOtpCodeService.sendOtpCode(emailOrPhone);
            return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn. Mã có hiệu lực trong 5 phút.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi gửi mã OTP. Vui lòng thử lại sau.");
        }
    }

    // Reset password using OTP code
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            passwordOtpCodeService.resetPassword(
                    resetPasswordRequest.getEmailOrPhone(),
                    resetPasswordRequest.getOtpCode(),
                    resetPasswordRequest.getNewPassword()
            );
            return ResponseEntity.ok("Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập lại.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.");
        }
    }
}
