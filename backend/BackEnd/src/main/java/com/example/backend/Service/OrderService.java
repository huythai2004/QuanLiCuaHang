package com.example.backend.Service;

import com.example.backend.DTO.CreateOrderRequest;
import com.example.backend.DTO.OrderDetailResponse;
import com.example.backend.Entity.Customers;
import com.example.backend.Entity.Order;
import com.example.backend.Entity.Order_Items;
import com.example.backend.Entity.User;
import com.example.backend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Autowired
    private CustomersRepository customersRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        // Get User information to sync
        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

        // Find or create customer
        Customers customer = customersRepository.findByUserId(request.getUserId()).orElseGet(() -> {
            // Tạo Customer mới từ thông tin User
            Customers newCustomer = new Customers();
            newCustomer.setUserId(request.getUserId());
            newCustomer.setFullName(user.getFullName());
            newCustomer.setAddress(user.getAddress()); // Lấy từ User table
            return customersRepository.save(newCustomer);
        });

        // Use address from Customer synsc
        String shippingAddress = customer.getAddress() != null && !customer.getAddress().isEmpty() ? customer.getAddress() : request.getShippingAddress();

        // Create order
        Order order = new Order();
        order.setCustomerId(customer.getId());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING"); // PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED
        order.setTotal(request.getTotal());
        order.setShippingAddress(shippingAddress); // Ưu tiên address từ Customer

        Order savedOrder = orderRepository.save(order);

        // Create order items
        for (CreateOrderRequest.OrderItemDTO itemDTO : request.getItems()) {
            Order_Items orderItem = new Order_Items();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(itemDTO.getProductId());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setUnitPrice(itemDTO.getUnitPrice());
            // orderItem.setLineTotal(itemDTO.getUnitPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));

            orderItemsRepository.save(orderItem);
        }
        return savedOrder;
    }

    //Get order Total
    public BigDecimal getOrderTotal(Long orderId) {
        List<Order_Items> orderItems = orderItemsRepository.findByOrderId(orderId);

        if (orderItems.isEmpty()) {
            throw new RuntimeException("Không tìm thấy sản phẩm trong đơn hàng ID: " + orderId);
        }
        //Fallback
        return orderItems.stream().map(item -> {
            if (item.getLineTotal() != null) {
                return item.getLineTotal();
            } else {
                return item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            }
        }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Function Get order Detail
    public OrderDetailResponse getOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        Customers customer = customersRepository.findById(order.getCustomerId()).orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Order_Items> orderItems = orderItemsRepository.findByOrderId(orderId);

        // Build response
        OrderDetailResponse response = new OrderDetailResponse();
        response.setOrderId(order.getId());
        response.setCustomerId(customer.getId());
        response.setCustomerName(customer.getFullName());
        response.setShippingAddress(order.getShippingAddress());
        response.setOrderDate(order.getOrderDate());
        response.setStatus(order.getStatus());
        response.setTotal(order.getTotal());

        // Map order items
        List<OrderDetailResponse.OrderItemDetail> itemDetails = orderItems.stream().map(item -> {
            OrderDetailResponse.OrderItemDetail detail = new OrderDetailResponse.OrderItemDetail();
            detail.setProductId(item.getProductId());
            detail.setQuantity(item.getQuantity());
            detail.setUnitPrice(item.getUnitPrice());
            detail.setLineTotal(item.getLineTotal());

            // Get product info
            productsRepository.findById(item.getProductId()).ifPresent(product -> {
                detail.setProductName(product.getName());
                // Get first image if available
                if (product.getImages() != null && !product.getImages().isEmpty()) {
                    detail.setProductImage(product.getImages().get(0).getImageUrl());
                }
            });

            return detail;
        }).collect(Collectors.toList());

        response.setItems(itemDetails);

        // Get payment info if exists
        paymentsRepository.findByOrderId(orderId).ifPresent(payment -> {
            OrderDetailResponse.PaymentInfo paymentInfo = new OrderDetailResponse.PaymentInfo();
            paymentInfo.setMethod(payment.getMethod());
            paymentInfo.setStatus(payment.getStatus());
            paymentInfo.setTransactionNo(payment.getTransactionNo());
            paymentInfo.setBankCode(payment.getBankCode());
            paymentInfo.setPaidAt(payment.getPaidAt());
            response.setPayment(paymentInfo);
        });

        return response;
    }

    public List<OrderDetailResponse> getOrdersByCustomer(Long userId) {
        Customers customer = customersRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customer.getId());

        return orders.stream().map(order -> getOrderDetail(order.getId())).collect(Collectors.toList());
    }

    public List<OrderDetailResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> getOrderDetail(order.getId())).collect(Collectors.toList());
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Chỉ cho phép hủy đơn hàng đang chờ thanh toán
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy đơn hàng đang chờ thanh toán");
        }

        // Cập nhật status thành CANCELLED
        order.setStatus("CANCELLED");
        orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Chỉ cho phép xóa đơn hàng đã hủy
        if (!"CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể xóa đơn hàng đã hủy");
        }

        // delete order items first
        orderItemsRepository.deleteByOrderId(orderId);
        
        // delete payments
        paymentsRepository.deleteByOrderId(orderId);
        
        // delete order
        orderRepository.deleteById(orderId);
    }
}

