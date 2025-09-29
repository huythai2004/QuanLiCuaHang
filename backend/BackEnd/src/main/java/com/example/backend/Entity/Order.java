package com.example.backend.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;
    
    @Column(name = "status", nullable = false, length = 30)
    private String status;
    
    @Column(name = "total", precision = 14, scale = 2, nullable = false)
    private BigDecimal total;
    
    @Column(name = "shipping_address", length = 255)
    private String shippingAddress;

    public Order() {
    }

    public Order(Long id, Long customerId, LocalDateTime orderDate, String status, 
                BigDecimal total, String shippingAddress) {
        this.id = id;
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.status = status;
        this.total = total;
        this.shippingAddress = shippingAddress;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}
