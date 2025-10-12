# Hướng dẫn Upload Ảnh từ URL

## Tổng quan

Hệ thống hiện đã hỗ trợ upload ảnh cho sản phẩm bằng cách nhập URL ảnh từ web. Hệ thống sẽ tự động:
1. Tải ảnh từ URL
2. Upload lên Cloudinary
3. Lưu URL Cloudinary vào database

## API Endpoints

### 1. Upload một ảnh từ URL

**Endpoint:** `POST /product-images/upload-from-url/{productId}`

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Image uploaded successfully from URL",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/...",
  "imageId": 123,
  "originalUrl": "https://example.com/image.jpg"
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Failed to upload image from URL: [error details]"
}
```

**Ví dụ sử dụng với cURL:**
```bash
curl -X POST http://localhost:8080/product-images/upload-from-url/1 \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/product-image.jpg"}'
```

**Ví dụ sử dụng với JavaScript/Axios:**
```javascript
const uploadImageFromUrl = async (productId, imageUrl) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/product-images/upload-from-url/${productId}`,
      { imageUrl }
    );
    
    if (response.data.success) {
      console.log('Uploaded:', response.data.imageUrl);
      console.log('Image ID:', response.data.imageId);
    }
  } catch (error) {
    console.error('Upload failed:', error.response.data.message);
  }
};

// Sử dụng
uploadImageFromUrl(1, 'https://example.com/product.jpg');
```

### 2. Upload nhiều ảnh từ URLs

**Endpoint:** `POST /product-images/upload-multiple-from-urls/{productId}`

**Request Body:**
```json
{
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.png"
  ]
}
```

**Response Success:**
```json
{
  "success": true,
  "message": "Upload completed: 3 success, 0 failed",
  "successCount": 3,
  "failCount": 0,
  "uploadedImages": [
    {
      "imageId": 123,
      "cloudinaryUrl": "https://res.cloudinary.com/.../image1.jpg",
      "originalUrl": "https://example.com/image1.jpg"
    },
    {
      "imageId": 124,
      "cloudinaryUrl": "https://res.cloudinary.com/.../image2.jpg",
      "originalUrl": "https://example.com/image2.jpg"
    },
    {
      "imageId": 125,
      "cloudinaryUrl": "https://res.cloudinary.com/.../image3.png",
      "originalUrl": "https://example.com/image3.png"
    }
  ]
}
```

**Response với một số lỗi:**
```json
{
  "success": true,
  "message": "Upload completed: 2 success, 1 failed",
  "successCount": 2,
  "failCount": 1,
  "uploadedImages": [...],
  "errors": [
    "https://example.com/broken-image.jpg: Failed to download image: HTTP 404"
  ]
}
```

**Ví dụ sử dụng với cURL:**
```bash
curl -X POST http://localhost:8080/product-images/upload-multiple-from-urls/1 \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }'
```

**Ví dụ sử dụng với JavaScript/Axios:**
```javascript
const uploadMultipleImagesFromUrls = async (productId, imageUrls) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/product-images/upload-multiple-from-urls/${productId}`,
      { imageUrls }
    );
    
    console.log(`Success: ${response.data.successCount}`);
    console.log(`Failed: ${response.data.failCount}`);
    
    response.data.uploadedImages.forEach(img => {
      console.log(`Uploaded: ${img.originalUrl} -> ${img.cloudinaryUrl}`);
    });
    
    if (response.data.errors) {
      console.log('Errors:', response.data.errors);
    }
  } catch (error) {
    console.error('Upload failed:', error.response.data.message);
  }
};

// Sử dụng
const imageUrls = [
  'https://example.com/product1.jpg',
  'https://example.com/product2.jpg',
  'https://example.com/product3.png'
];
uploadMultipleImagesFromUrls(1, imageUrls);
```

## Validation và Giới hạn

### URL Requirements:
- URL phải hợp lệ và trỏ đến một file ảnh
- Content-Type của response phải là `image/*`
- URL phải trả về HTTP 200

### File Size Limits:
- Kích thước file tối đa: **5MB**
- Nếu ảnh lớn hơn 5MB, request sẽ bị reject

### Timeout:
- Connect timeout: 10 giây
- Read timeout: 10 giây

### Supported Image Formats:
- Tất cả các định dạng ảnh phổ biến (JPEG, PNG, GIF, WebP, v.v.)
- Cloudinary sẽ tự động xử lý và tối ưu hóa

## Error Messages

| Error | Description |
|-------|-------------|
| `Image URL cannot be empty` | URL ảnh không được để trống |
| `Image URL is required` | Thiếu field imageUrl trong request |
| `Invalid URL format` | URL không đúng định dạng |
| `Failed to download image: HTTP XXX` | Server không thể tải ảnh (status code khác 200) |
| `URL does not point to an image file` | URL không trỏ đến một file ảnh |
| `Downloaded image size exceeds 5MB limit` | Ảnh quá lớn |
| `Image URLs list is required` | Thiếu field imageUrls khi upload nhiều ảnh |

## So sánh với Upload File

### Upload File (cũ):
- **Endpoint:** `POST /product-images/upload/{productId}`
- **Content-Type:** `multipart/form-data`
- **Pros:** Có thể upload ảnh từ máy local
- **Cons:** Phải chọn file, upload mất thời gian với ảnh lớn

### Upload từ URL (mới):
- **Endpoint:** `POST /product-images/upload-from-url/{productId}`
- **Content-Type:** `application/json`
- **Pros:** 
  - Chỉ cần paste URL
  - Không cần tải ảnh về máy
  - Có thể upload nhiều ảnh cùng lúc
  - Nhanh hơn với ảnh đã có sẵn trên web
- **Cons:** 
  - Cần ảnh đã có sẵn URL công khai
  - Phụ thuộc vào tốc độ download từ URL nguồn

## Lưu ý quan trọng

1. **CORS:** Backend đã được cấu hình CORS cho `http://localhost:3000`. Nếu deploy production, cần cập nhật origin.

2. **Security:** 
   - API này có thể bị abuse nếu không có authentication
   - Nên thêm rate limiting để tránh spam
   - Kiểm tra quyền của user trước khi cho phép upload

3. **Cloudinary Storage:**
   - Mỗi ảnh upload sẽ tốn storage trên Cloudinary
   - Nên có policy để dọn dẹp ảnh không sử dụng
   - Kiểm tra quota Cloudinary để tránh vượt giới hạn

4. **Database:**
   - Mỗi ảnh sẽ tạo một record trong bảng `product_images`
   - URL Cloudinary sẽ được lưu trong field `image_url`

## Testing

### Test với Postman:
1. Mở Postman
2. Tạo request POST: `http://localhost:8080/product-images/upload-from-url/1`
3. Chọn Body > raw > JSON
4. Nhập:
   ```json
   {
     "imageUrl": "https://picsum.photos/800/600"
   }
   ```
5. Send

### Test với Browser Console:
```javascript
fetch('http://localhost:8080/product-images/upload-from-url/1', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    imageUrl: 'https://picsum.photos/800/600'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## Integration với Frontend

Xem file ví dụ: `docs/examples/ProductImageUploadForm.jsx`

