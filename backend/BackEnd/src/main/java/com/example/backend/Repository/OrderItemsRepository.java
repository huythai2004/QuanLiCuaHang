package com.example.backend.Repository;

import com.example.backend.Entity.Order_Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemsRepository extends JpaRepository<Order_Items, Long> {
    List<Order_Items> findByOrderId(Long orderId);
}

