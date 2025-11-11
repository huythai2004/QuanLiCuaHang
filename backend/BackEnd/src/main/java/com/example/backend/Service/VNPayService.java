//package com.example.backend.Service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.text.SimpleDateFormat;
//import java.util.*;
//
//@Service
//public class VNPayService {
//    @Value("${vnpay.tmn-code}")
//    private String vnp_TmnCode;
//
//    @Value("${vnpay.hash-secret}")
//    private String vnp_HashSecret;
//
//    @Value("${vnpay.url}")
//    private String vnp_Url;
//
//    @Value("${vnpay.return-url}")
//    private String vnp_ReturnUrl;
//
//    public String createPaymentUrl(Long orderId, double amount, String ipAddress) throws Exception {
//        Map<String, String> params = new HashMap<>();
//        params.put("vnp_Version", "2.1.0");
//        params.put("vnp_Command", "pay");
//        params.put("vnp_TmnCode", vnp_TmnCode);
//        params.put("vnp_Amount", String.valueOf((long) (amount * 100)));
//        params.put("vnp_CurrCode", "VND");
//        params.put("vnp_TxnRef", String.valueOf(orderId));
//        params.put("vnp_OrderInfo", "Thanh toan don hang: " + orderId);
//        params.put("vnp_OrderType", "other");
//        params.put("vnp_Locale", "vn");
//        params.put("vnp_ReturnUrl", vnp_ReturnUrl);
//        params.put("vnp_IpAddress", ipAddress);
//        params.put("vnp_BankCode", "NCB");
//
//        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//        params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime()));
//        cld.add(Calendar.MINUTE, 15);
//        params.put("vnp_ExpireDate", new SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime()));
//
//        String hashData = buildHashData(params);
//        String secureHash = hmacSHA512(vnp_HashSecret, hashData);
//        String queryUrl = buildQueryUrl(params) + "&vnp_SecureHash=" + secureHash;
//
//        System.out.println("Hash Data: " + hashData);
//        System.out.println("Secure Hash: " + secureHash);
//        System.out.println("Return URL: " + vnp_ReturnUrl);
//
//        return vnp_Url + "?" + queryUrl;
//    }
//
//    private String buildHashData(Map<String, String> params) {
//        List<String> fieldNames = new ArrayList<>(params.keySet());
//        Collections.sort(fieldNames);
//
//        StringBuilder hashData = new StringBuilder();
//        for (int i = 0; i < fieldNames.size(); i++) {
//            String name = fieldNames.get(i);
//            String value = params.get(name);
//            if (value != null && !value.isEmpty()) {
//                hashData.append(name).append("=").append(value);
//                if (i < fieldNames.size() - 1) hashData.append("&");
//            }
//        }
//        return hashData.toString();
//    }
//
//    private String buildQueryUrl(Map<String, String> params) throws Exception {
//        StringBuilder query = new StringBuilder();
//        List<String> fieldNames = new ArrayList<>(params.keySet());
//        Collections.sort(fieldNames);
//        for (int i = 0; i < fieldNames.size(); i++) {
//            String name = fieldNames.get(i);
//            String value = params.get(name);
//            if (value != null && !value.isEmpty()) {
//                query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII))
//                        .append("=")
//                        .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
//                if (i < fieldNames.size() - 1) query.append("&");
//            }
//        }
//        return query.toString();
//    }
//
//    public boolean verifyPaymentReturn(Map<String, String> params) throws Exception {
//        String vnp_SecureHash = params.get("vnp_SecureHash");
//        Map<String, String> fields = new HashMap<>(params);
//        fields.remove("vnp_SecureHash");
//        fields.remove("vnp_SecureHashType");
//
//        String hashData = buildHashData(fields);
//        String myHash = hmacSHA512(vnp_HashSecret, hashData);
//
//        System.out.println("=== VERIFY HASH DEBUG ===");
//        System.out.println("HashData: " + hashData);
//        System.out.println("VNPay SecureHash: " + vnp_SecureHash);
//        System.out.println("My SecureHash: " + myHash);
//        System.out.println("=========================");
//
//        return vnp_SecureHash != null && vnp_SecureHash.equalsIgnoreCase(myHash);
//    }
//
//    private String hmacSHA512(String key, String data) throws Exception {
//        Mac hmac512 = Mac.getInstance("HmacSHA512");
//        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
//        hmac512.init(secretKeySpec);
//        byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
//        StringBuilder hash = new StringBuilder();
//        for (byte b : bytes) hash.append(String.format("%02x", b));
//        return hash.toString();
//    }
//}
