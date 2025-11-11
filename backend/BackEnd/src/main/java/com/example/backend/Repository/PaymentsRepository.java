package com.example.backend.Repository;

import com.example.backend.Entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentsRepository extends JpaRepository<Payments, Long> {
    Optional<Payments> findByOrderId(Long orderId);
    Optional<Payments> findByTransactionNo(String transactionNo);    
    void deleteByOrderId(Long orderId);
}