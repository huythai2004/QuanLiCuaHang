# Hướng dẫn Update/Thay đổi Ảnh Product

## 🎯 Mục đích

Khi test hoặc quản lý sản phẩm, đôi khi bạn muốn **thay đổi ảnh** thay vì xóa và thêm mới. API này giúp bạn:
- ✅ Thay thế ảnh cũ bằng ảnh mới
- ✅ Giữ nguyên Image ID
- ✅ Tự động xóa ảnh cũ trên Cloudinary (tiết kiệm storage)
- ✅ Upload ảnh mới lên Cloudinary
- ✅ Update URL mới vào database

---

## 📋 API Endpoint

### Update Image từ URL

**Method:** `PUT`

**URL:** 
```
http://localhost:8080/product-images/update-from-url/{imageId}
```

**Request Body:**
```json
{
  "imageUrl": "https://new-image-url.com/image.jpg"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Image updated successfully",
  "imageId": 123,
  "oldImageUrl": "https://res.cloudinary.com/.../old-image.jpg",
  "newImageUrl": "https://res.cloudinary.com/.../new-image.jpg",
  "originalUrl": "https://new-image-url.com/image.jpg"
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Image not found with ID: 999"
}
```

---

## 🧪 Test trong Postman

### Bước 1: Lấy Image ID cần update

Trước tiên, lấy danh sách ảnh của product để biết Image ID:

**GET:**
```
http://localhost:8080/product-images/product/5
```

**Response:**
```json
[
  {
    "id": 123,           ← Đây là imageId bạn cần
    "productId": 5,
    "imageUrl": "https://res.cloudinary.com/.../old-image.jpg"
  },
  {
    "id": 124,
    "productId": 5,
    "imageUrl": "https://res.cloudinary.com/.../another-image.jpg"
  }
]
```

### Bước 2: Update ảnh

**Method:** `PUT`

**URL:**
```
http://localhost:8080/product-images/update-from-url/123
                                                     ^^^
                                              Thay bằng Image ID thực tế
```

**Headers:**
- **Key:** `Content-Type`
- **Value:** `application/json`

**Body (raw JSON):**
```json
{
  "imageUrl": "https://down-vn.img.susercontent.com/file/new-image.webp"
}
```

### Bước 3: Click Send

Response sẽ trả về:
```json
{
  "success": true,
  "message": "Image updated successfully",
  "imageId": 123,
  "oldImageUrl": "https://res.cloudinary.com/.../old-image.jpg",
  "newImageUrl": "https://res.cloudinary.com/.../new-image.jpg",
  "originalUrl": "https://down-vn.img.susercontent.com/file/new-image.webp"
}
```

### Bước 4: Verify (Optional)

Get lại danh sách ảnh để verify:

**GET:**
```
http://localhost:8080/product-images/product/5
```

Bạn sẽ thấy ảnh đã được update!

---

## 📸 Hướng dẫn chi tiết trong Postman

### Setup Request:

```
┌─────────────────────────────────────────────────────────────────┐
│ PUT   http://localhost:8080/product-images/update-from-url/123 │
│ ^^^                                                       ^^^   │
│ Method là PUT!                               Image ID cần update│
├─────────────────────────────────────────────────────────────────┤
│ Params │ Authorization │ Headers │ Body │ Pre-req │ Tests      │
│                                    ▲                             │
├─────────────────────────────────────────────────────────────────┤
│ Headers:                                                         │
│   Content-Type: application/json        ✓                       │
├─────────────────────────────────────────────────────────────────┤
│ Body:                                                            │
│ ○ none   ○ form-data   ○ x-www-form-urlencoded                 │
│ ● raw    ○ binary                                                │
│                                                                  │
│ Text ▼  [JSON ▼]                                                │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ {                                                         │   │
│ │   "imageUrl": "https://picsum.photos/800/600?random=99"  │   │
│ │ }                                                         │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                               [Send] ▶          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 So sánh Update vs Delete+Add

### ❌ Cách cũ (Delete + Add):

**Bước 1: Delete ảnh cũ**
```
DELETE /product-images/123
```

**Bước 2: Add ảnh mới**
```
POST /product-images/upload-from-url/5
{
  "imageUrl": "new-image-url"
}
```

**Vấn đề:**
- 🔴 2 requests riêng biệt
- 🔴 Image ID thay đổi (từ 123 → 999)
- 🔴 Phức tạp hơn

### ✅ Cách mới (Update):

**Chỉ 1 request:**
```
PUT /product-images/update-from-url/123
{
  "imageUrl": "new-image-url"
}
```

**Ưu điểm:**
- ✅ Chỉ 1 request
- ✅ Image ID không đổi (vẫn là 123)
- ✅ Đơn giản, dễ quản lý

---

## 🎯 Use Cases (Khi nào dùng)

### ✅ Dùng UPDATE khi:
- Muốn thay đổi ảnh nhưng giữ nguyên Image ID
- Test và cần đổi ảnh nhanh
- Cập nhật ảnh sản phẩm mới hơn
- Sửa ảnh bị lỗi

### ✅ Dùng DELETE + ADD khi:
- Muốn xóa ảnh hoàn toàn
- Thêm thêm ảnh mới (không thay thế)

---

## 💡 Examples

### Example 1: Thay ảnh Shopee bằng ảnh test

**Step 1: Get images**
```
GET /product-images/product/5

Response:
[
  {
    "id": 123,
    "imageUrl": "https://res.cloudinary.com/.../shopee-image.jpg"
  }
]
```

**Step 2: Update với ảnh test**
```
PUT /product-images/update-from-url/123

Body:
{
  "imageUrl": "https://picsum.photos/800/600?random=1"
}
```

### Example 2: Thay ảnh test bằng ảnh thật

```
PUT /product-images/update-from-url/123

Body:
{
  "imageUrl": "https://down-vn.img.susercontent.com/file/real-product.webp"
}
```

### Example 3: Update nhiều ảnh (loop)

Nếu muốn update nhiều ảnh, gọi API nhiều lần:

**Image 123:**
```
PUT /product-images/update-from-url/123
{"imageUrl": "url1"}
```

**Image 124:**
```
PUT /product-images/update-from-url/124
{"imageUrl": "url2"}
```

**Image 125:**
```
PUT /product-images/update-from-url/125
{"imageUrl": "url3"}
```

---

## 🚨 Error Handling

### Error 1: Image ID không tồn tại

**Request:**
```
PUT /product-images/update-from-url/9999
```

**Response:**
```json
{
  "success": false,
  "message": "Image not found with ID: 9999"
}
```

**Fix:** Kiểm tra lại Image ID bằng GET `/product-images/product/{productId}`

### Error 2: URL rỗng

**Request:**
```json
{
  "imageUrl": ""
}
```

**Response:**
```json
{
  "success": false,
  "message": "New image URL is required"
}
```

**Fix:** Nhập đúng URL ảnh

### Error 3: URL không hợp lệ

**Request:**
```json
{
  "imageUrl": "not-a-valid-url"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Validation error: Invalid URL format"
}
```

**Fix:** Kiểm tra lại URL

---

## 🔧 Workflow hoàn chỉnh

### Scenario: Test product với nhiều ảnh

```
1. Upload ảnh ban đầu:
   POST /product-images/upload-multiple-from-urls/5
   {
     "imageUrls": [
       "https://picsum.photos/800/600?random=1",
       "https://picsum.photos/800/600?random=2"
     ]
   }
   
   → Response: imageId 123, 124

2. Test xong, muốn đổi ảnh 1:
   PUT /product-images/update-from-url/123
   {
     "imageUrl": "https://new-image.com/better-image.jpg"
   }
   
   → Image 123 đã được update!

3. Verify:
   GET /product-images/product/5
   
   → Thấy image 123 với URL mới

4. Nếu muốn xóa hẳn ảnh 2:
   DELETE /product-images/124
   
   → Image 124 bị xóa
```

---

## 📊 API Summary

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| **Upload 1 ảnh** | POST | `/upload-from-url/{productId}` | `{"imageUrl":"..."}` |
| **Upload nhiều ảnh** | POST | `/upload-multiple-from-urls/{productId}` | `{"imageUrls":[...]}` |
| **Update ảnh** | PUT | `/update-from-url/{imageId}` | `{"imageUrl":"..."}` |
| **Delete ảnh** | DELETE | `/{imageId}` | (none) |
| **Get ảnh của product** | GET | `/product/{productId}` | (none) |

---

## 🎓 Tips

### 1. Dùng Variables trong Postman

Set biến cho imageId:
```
PUT {{baseUrl}}/product-images/update-from-url/{{lastImageId}}
```

### 2. Save Image ID từ response

Trong tab **Tests** của request upload:
```javascript
pm.test("Save imageId", function () {
    var jsonData = pm.response.json();
    if (jsonData.imageId) {
        pm.environment.set("lastImageId", jsonData.imageId);
    }
});
```

### 3. Chain requests

Upload → Save ID → Update ngay:
- Request 1: Upload image
- Request 2: Update image (dùng `{{lastImageId}}`)

---

## ✅ Testing Checklist

- [ ] Update ảnh với URL hợp lệ
- [ ] Update ảnh với Image ID không tồn tại (expect error)
- [ ] Update ảnh với URL rỗng (expect error)
- [ ] Update ảnh với URL không hợp lệ (expect error)
- [ ] Verify ảnh cũ bị xóa trên Cloudinary
- [ ] Verify ảnh mới được upload lên Cloudinary
- [ ] Verify database có URL mới

---

## 🎯 Quick Reference

**Update một ảnh:**
```bash
# 1. Get Image ID
curl http://localhost:8080/product-images/product/5

# 2. Update
curl -X PUT http://localhost:8080/product-images/update-from-url/123 \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://picsum.photos/800/600"}'
```

**Postman:**
```
1. Method: PUT
2. URL: http://localhost:8080/product-images/update-from-url/123
3. Body: raw JSON
   {
     "imageUrl": "https://new-image-url.com/image.jpg"
   }
4. Send
```

---

Happy Testing! 🚀

