package com.example.backend.Repository;

import com.example.backend.Entity.Password_Reset_Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<Password_Reset_Token, Long> {
    Optional<Password_Reset_Token> findByUserIdAndOtpCode(Long userId, String otpCode);
}
