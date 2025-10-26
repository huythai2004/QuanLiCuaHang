package com.example.backend.DTO;

import java.math.BigDecimal;
import java.util.List;

public class CreateOrderRequest {
    private Long userId;
    private String shippingAddress;
    private String fullName;
    private String phone;
    private BigDecimal total;
    private List<OrderItemDTO> items;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(Long userId, String shippingAddress, String fullName, String phone, 
                             BigDecimal total, List<OrderItemDTO> items) {
        this.userId = userId;
        this.shippingAddress = shippingAddress;
        this.fullName = fullName;
        this.phone = phone;
        this.total = total;
        this.items = items;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public static class OrderItemDTO {
        private Long productId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String size;
        private String color;

        public OrderItemDTO() {
        }

        public OrderItemDTO(Long productId, Integer quantity, BigDecimal unitPrice, String size, String color) {
            this.productId = productId;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.size = size;
            this.color = color;
        }

        // Getters and Setters
        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }
    }
}

