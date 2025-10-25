package com.example.backend.Service;

import com.example.backend.Entity.Password_Reset_Token;
import com.example.backend.Entity.User;
import com.example.backend.Repository.PasswordResetTokenRepository;
import com.example.backend.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    // Send OTP code
    public void sendOtpCode(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email không tồn tại!"));
        //Create OTP code
        String otp = String.format("%06d", new Random().nextInt(999999));

        //Save in DB
        Password_Reset_Token token = new Password_Reset_Token();
        token.setUserId(user.getId());
        token.setOtpCode(otp);
        token.setExpiredAt(LocalDateTime.now().plusSeconds(30)); // Expire in 30 seconds
        token.setUsed(false);
        passwordResetTokenRepository.save(token);

        //Send Email
        //sendEmail(email, "Mã OTP của bạn là: " + otp + ". Mã này sẽ hết hạn trong 30 giây.");
        emailService.sendOtpEmail(email, otp);
    }

//    //Function to send email
//    public void sendEmail(String email, String message) {
//        System.out.println("Sending email to " + email + " with message: " + message);
//    }

    //Confirm OTP code
    public void resetPassword(String email, String otpCode, String newPassword) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        Password_Reset_Token token = passwordResetTokenRepository.findByUserIdAndOtpCode(user.getId(), otpCode).orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ!"));

        if (token.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn!");
        }

        //Update new password
        user.setpassword((passwordEncoder.encode(newPassword)));
        userRepository.save(user);

        //Confirm OTP code
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }


}
