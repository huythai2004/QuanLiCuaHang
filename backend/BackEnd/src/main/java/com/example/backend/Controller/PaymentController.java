package com.example.backend.Controller;

import com.example.backend.Entity.Payments;
import com.example.backend.Repository.PaymentsRepository;
import com.example.backend.Service.OrderService;
// import com.example.backend.Service.VNPayService;
// import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")

public class PaymentController {
    
    // VNPay integration disabled per new flow
    // @Autowired
    // private VNPayService vnpPayService;

    @Autowired
    private PaymentsRepository paymentsRepository;

    @Autowired
    private OrderService orderService;

    // Placeholder endpoint to satisfy frontend calls and CORS preflight
    @GetMapping("/vnpay")
    public ResponseEntity<?> createPaymentDisabled(@RequestParam("orderId") Long orderId,
                                                   @RequestParam(value = "amount", required = false) BigDecimal amount) {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", orderId,
                "message", "Bạn đã đặt hàng thành công"
        ));
    }

    // VNPay return endpoint disabled - kept as comment for future use
//    @GetMapping("/vnpay_return")
//    public ResponseEntity<?> paymentReturnDisabled (@RequestParam Map<String, String> params) {
//        return ResponseEntity.ok(Map.of(
//                "success", true,
//                "message", "Thanh toán VNPay đã tạm dừng theo yêu cầu nghiệp vụ mới"
//        ));
//    }

    // New manual confirmation endpoint: create payment record and set order status to PAID
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestParam("orderId") Long orderId,
                                            @RequestParam(value = "method", defaultValue = "COD") String method) {
        try {
            BigDecimal amount = orderService.getOrderTotal(orderId);
            Payments payment = new Payments();
            payment.setOrderId(orderId);
            payment.setMethod(method);
            payment.setAmount(amount);
            payment.setTransactionNo(null);
            payment.setBankCode(null);
            payment.setStatus("SUCCESS");
            payment.setPaidAt(LocalDateTime.now());
            paymentsRepository.save(payment);

            orderService.updateOrderStatus(orderId, "PAID");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "orderId", orderId,
                    "message", "Xác nhận thanh toán thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không thể xác nhận thanh toán: " + e.getMessage()
            ));
        }
    }
}
