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
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("[Quản Lý Cửa Hàng] Mã OTP Đặt Lại Mật Khẩu");
            message.setText(
                "Xin chào,\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.\n\n" +
                "Mã OTP của bạn là: " + otpCode + "\n\n" +
                "Mã này có hiệu lực trong 5 phút.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Monsieur Tom"
            );
            javaMailSender.send(message);
            System.out.println("Email OTP đã gửi thành công đến: " + to);
        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
            throw new RuntimeException("Không thể gửi email OTP: " + e.getMessage());
        }
    }
}
