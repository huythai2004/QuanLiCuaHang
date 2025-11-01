package com.example.backend.Service;

import com.example.backend.Entity.Password_Reset_Token;
import com.example.backend.Entity.User;
import com.example.backend.Repository.PasswordResetTokenRepository;
import com.example.backend.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;


@Service
public class PasswordOtpCodeService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordOtpCodeService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Send OTP code - Support both email and phone
    @Transactional
    public void sendOtpCode(String emailOrPhone) {
        if (emailOrPhone == null || emailOrPhone.trim().isEmpty()) {
            throw new RuntimeException("Email hoặc số điện thoại không được để trống");
        }

        // Find user by email or phone
        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email/Số điện thoại không tồn tại hoặc chưa được đăng ký!");
        }
        
        User user = userOpt.get();

        // Delete old OTP tokens for this user
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Create OTP code (6 digits)
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save in DB
        Password_Reset_Token token = new Password_Reset_Token();
        token.setUserId(user.getId());
        token.setOtpCode(otp);
        token.setExpiredAt(LocalDateTime.now().plusMinutes(5)); // Expire in 5 minutes
        token.setUsed(false);
        passwordResetTokenRepository.save(token);

        // Send Email
        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email. Vui lòng thử lại sau.");
        }
    }

    // Reset password with OTP code
    @Transactional
    public void resetPassword(String emailOrPhone, String otpCode, String newPassword) {
        // Validate input
        if (emailOrPhone == null || emailOrPhone.trim().isEmpty()) {
            throw new RuntimeException("Email/Số điện thoại không được để trống");
        }
        if (otpCode == null || otpCode.trim().isEmpty()) {
            throw new RuntimeException("Mã OTP không được để trống");
        }
        if (newPassword == null || newPassword.length() < 8) {
            throw new RuntimeException("Mật khẩu mới phải có ít nhất 8 ký tự");
        }

        // Find user by email or phone
        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email/Số điện thoại không tồn tại hoặc chưa được đăng ký!");
        }
        
        User user = userOpt.get();

        // Find and validate OTP token
        Password_Reset_Token token = passwordResetTokenRepository
                .findByUserIdAndOtpCode(user.getId(), otpCode)
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ!"));
                
        if (token.getUsed()) {
            throw new RuntimeException("Mã OTP đã được sử dụng");
        }
        
        if (token.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn!");
        }

        // Update new password
        String encodedPassword = passwordEncoder.encode(newPassword);
        System.out.println("Resetting password for user: " + user.getId() + " (" + user.getEmail() + ")");
        System.out.println("New password hash: " + encodedPassword.substring(0, Math.min(20, encodedPassword.length())) + "...");
        user.setpassword(encodedPassword);
        // Use saveAndFlush to ensure password is saved to database immediately
        User savedUser = userRepository.saveAndFlush(user);
        System.out.println("Password reset completed for user: " + savedUser.getId());

        // Mark OTP as used
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }


}
