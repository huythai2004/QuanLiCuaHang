import React, { useState } from 'react';
import axios from 'axios';

/**
 * Form component để upload ảnh sản phẩm từ URL
 */
const ProductImageUploadForm = ({ productId }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadedImages, setUploadedImages] = useState([]);

  const API_BASE_URL = 'http://localhost:8080';

  /**
   * Upload một ảnh từ URL
   */
  const handleSingleUpload = async (e) => {
    e.preventDefault();
    
    if (!imageUrl.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập URL ảnh' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-images/upload-from-url/${productId}`,
        { imageUrl: imageUrl.trim() }
      );

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: `Upload thành công! Image ID: ${response.data.imageId}` 
        });
        setUploadedImages(prev => [...prev, response.data]);
        setImageUrl(''); // Clear input
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi upload';
      setMessage({ type: 'error', text: errorMsg });
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload nhiều ảnh từ URLs (mỗi URL một dòng)
   */
  const handleMultipleUpload = async (e) => {
    e.preventDefault();
    
    const urls = imageUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      setMessage({ type: 'error', text: 'Vui lòng nhập ít nhất một URL' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-images/upload-multiple-from-urls/${productId}`,
        { imageUrls: urls }
      );

      if (response.data.success) {
        const { successCount, failCount } = response.data;
        setMessage({ 
          type: successCount > 0 ? 'success' : 'error', 
          text: `Upload hoàn tất: ${successCount} thành công, ${failCount} thất bại` 
        });
        
        if (response.data.uploadedImages) {
          setUploadedImages(prev => [...prev, ...response.data.uploadedImages]);
        }
        
        if (response.data.errors && response.data.errors.length > 0) {
          console.error('Upload errors:', response.data.errors);
        }
        
        setImageUrls(''); // Clear input
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi upload';
      setMessage({ type: 'error', text: errorMsg });
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xóa ảnh
   */
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/product-images/${imageId}`
      );

      if (response.data.success) {
        setUploadedImages(prev => prev.filter(img => img.imageId !== imageId));
        setMessage({ type: 'success', text: 'Đã xóa ảnh thành công' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa ảnh';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="product-image-upload">
      <h2>Upload Ảnh Sản Phẩm từ URL</h2>
      
      {/* Message Display */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Single Image Upload */}
      <div className="upload-section">
        <h3>Upload một ảnh</h3>
        <form onSubmit={handleSingleUpload}>
          <div className="form-group">
            <label htmlFor="imageUrl">URL ảnh:</label>
            <input
              type="text"
              id="imageUrl"
              className="form-control"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang upload...' : 'Upload'}
          </button>
        </form>
      </div>

      <hr />

      {/* Multiple Images Upload */}
      <div className="upload-section">
        <h3>Upload nhiều ảnh</h3>
        <form onSubmit={handleMultipleUpload}>
          <div className="form-group">
            <label htmlFor="imageUrls">
              URLs ảnh (mỗi URL một dòng):
            </label>
            <textarea
              id="imageUrls"
              className="form-control"
              rows="5"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.png"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang upload...' : 'Upload tất cả'}
          </button>
        </form>
      </div>

      <hr />

      {/* Uploaded Images Display */}
      {uploadedImages.length > 0 && (
        <div className="uploaded-images">
          <h3>Ảnh đã upload ({uploadedImages.length})</h3>
          <div className="images-grid">
            {uploadedImages.map((img) => (
              <div key={img.imageId} className="image-card">
                <img 
                  src={img.cloudinaryUrl || img.imageUrl} 
                  alt={`Product ${productId}`}
                  className="product-image"
                />
                <div className="image-info">
                  <small>ID: {img.imageId}</small>
                  {img.originalUrl && (
                    <small>
                      <a 
                        href={img.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Original
                      </a>
                    </small>
                  )}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteImage(img.imageId)}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .product-image-upload {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        textarea.form-control {
          font-family: monospace;
          resize: vertical;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-primary:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        .btn-sm {
          padding: 5px 10px;
          font-size: 12px;
        }

        .alert {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .alert-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .image-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }

        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .image-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 10px;
          font-size: 12px;
          color: #666;
        }

        hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 30px 0;
        }
      `}</style>
    </div>
  );
};

export default ProductImageUploadForm;

/**
 * USAGE EXAMPLE:
 * 
 * import ProductImageUploadForm from './components/ProductImageUploadForm';
 * 
 * function ProductPage() {
 *   const productId = 1; // ID của sản phẩm
 * 
 *   return (
 *     <div>
 *       <h1>Quản lý sản phẩm</h1>
 *       <ProductImageUploadForm productId={productId} />
 *     </div>
 *   );
 * }
 */

