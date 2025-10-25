package com.example.backend.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender javaMailSender;
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendOtpEmail(String to, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Mã xác nhận đặt lại mật khẩu");
        message.setText("Xin chào!\n\nMã OTP của bạn là: " + otpCode +
                "\nMã này có hiệu lực trong 30s.\\n\\nNếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.");
        javaMailSender.send(message);
    }
}
