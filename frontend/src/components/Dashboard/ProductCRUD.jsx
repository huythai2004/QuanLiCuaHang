import React, { useState, useEffect } from 'react';
import '../../css/main.css';
import '../../css/util.css';
import '../../vendor/bootstrap/css/bootstrap.min.css';
import '../../fonts/font-awesome-4.7.0/css/font-awesome.min.css';

const ProductCRUD = ({ products, onRefresh, onUpdateStats }) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stockQty: '',
    isActive: true
  });
  const [categories, setCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [originalImages, setOriginalImages] = useState([]); // Lưu hình ảnh gốc từ DB khi edit

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/categories');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      sku: '',
      name: '',
      description: '',
      categoryId: '',
      price: '',
      stockQty: '',
      isActive: true
    });
    setPreviewImages([]);
    setImageFiles([]);
    setImageUrls(['']);
    setOriginalImages([]);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      categoryId: product.categoryId || '',
      price: product.price || '',
      stockQty: product.stockQty || product.stock || '',
      isActive: product.isActive !== undefined ? product.isActive : true
    });
    // Set existing images as previews and save original images with IDs
    if (product.images && product.images.length > 0) {
      setPreviewImages(product.images.map(img => img.imageUrl));
      setOriginalImages(product.images); // Lưu cả id và imageUrl
    } else {
      setPreviewImages([]);
      setOriginalImages([]);
    }
    setImageFiles([]);
    setImageUrls(['']);
    setShowProductModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    const previewPromises = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" không phải là hình ảnh!`);
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá 5MB!`);
        return;
      }
      validFiles.push(file);
      
      // Create preview promise
      const previewPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
      previewPromises.push(previewPromise);
    });

    // Wait for all previews to load, then update state
    Promise.all(previewPromises).then((newPreviews) => {
      setPreviewImages([...previewImages, ...newPreviews]);
    });

    setImageFiles([...imageFiles, ...validFiles]);
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrlField = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const removeImagePreview = (index) => {
    // Xóa khỏi preview
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    
    // Nếu là file mới, xóa khỏi imageFiles
    // Lưu ý: chỉ có file mới mới có trong imageFiles
    // Image cũ từ DB không có trong imageFiles
    if (index < imageFiles.length) {
      setImageFiles(imageFiles.filter((_, i) => i !== index));
    }
    
    // Nếu là image cũ từ DB, đánh dấu để xóa
    // Logic này sẽ được xử lý khi save
  };

  const uploadImageToCloudinary = async (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`http://localhost:8080/product-images/upload/${productId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể upload hình ảnh');
    }

    return await response.json();
  };

  const uploadMultipleImagesToCloudinary = async (productId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`http://localhost:8080/product-images/upload-multiple/${productId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể upload hình ảnh');
    }

    return await response.json();
  };

  const uploadImageUrlsToCloudinary = async (productId, urls) => {
    const validUrls = urls.filter(url => url && url.trim() !== '');
    if (validUrls.length === 0) return null;

    const response = await fetch(`http://localhost:8080/product-images/upload-multiple-from-urls/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrls: validUrls })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể upload hình ảnh từ URL');
    }

    return await response.json();
  };

  const deleteImageFromDatabase = async (imageId) => {
    const response = await fetch(`http://localhost:8080/product-images/${imageId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể xóa hình ảnh');
    }

    return await response.json();
  };

  const handleSaveProduct = async () => {
    try {
      if (!productForm.sku || !productForm.name || !productForm.price || !productForm.stockQty) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc!');
        return;
      }

      const productData = {
        sku: productForm.sku,
        name: productForm.name,
        description: productForm.description || '',
        categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
        price: parseFloat(productForm.price),
        stockQty: parseInt(productForm.stockQty),
        isActive: productForm.isActive
      };

      let response;
      let savedProduct;

      if (editingProduct) {
        // Update existing product
        response = await fetch(`http://localhost:8080/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert('Lỗi: ' + (errorData.message || 'Không thể cập nhật sản phẩm'));
          return;
        }

        savedProduct = await response.json();

        setUploadingImage(true);
        try {
          // 1. Xóa những hình ảnh đã bị remove
          const currentImageUrls = previewImages;
          const imagesToDelete = originalImages.filter(img => 
            !currentImageUrls.includes(img.imageUrl)
          );
          
          if (imagesToDelete.length > 0) {
            const deletePromises = imagesToDelete.map(img => 
              deleteImageFromDatabase(img.id)
            );
            await Promise.all(deletePromises);
          }

          // 2. Upload hình ảnh mới nếu có
          if (imageFiles.length > 0 || imageUrls.some(url => url && url.trim() !== '')) {
            const uploadPromises = [];
            
            // Upload files
            if (imageFiles.length > 0) {
              uploadPromises.push(uploadMultipleImagesToCloudinary(savedProduct.id, imageFiles));
            }
            
            // Upload URLs
            const validUrls = imageUrls.filter(url => url && url.trim() !== '');
            if (validUrls.length > 0) {
              uploadPromises.push(uploadImageUrlsToCloudinary(savedProduct.id, validUrls));
            }
            
            await Promise.all(uploadPromises);
          }
        } catch (error) {
          console.error('Error managing images:', error);
          alert('Sản phẩm đã được cập nhật nhưng xử lý hình ảnh thất bại: ' + error.message);
        } finally {
          setUploadingImage(false);
        }

        alert('Cập nhật sản phẩm thành công!');
      } else {
        // Create new product
        response = await fetch('http://localhost:8080/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert('Lỗi: ' + (errorData.message || 'Không thể tạo sản phẩm'));
          return;
        }

        savedProduct = await response.json();

        // Upload images if provided
        if (imageFiles.length > 0 || imageUrls.some(url => url && url.trim() !== '')) {
          setUploadingImage(true);
          try {
            const uploadPromises = [];
            
            // Upload files
            if (imageFiles.length > 0) {
              uploadPromises.push(uploadMultipleImagesToCloudinary(savedProduct.id, imageFiles));
            }
            
            // Upload URLs
            const validUrls = imageUrls.filter(url => url && url.trim() !== '');
            if (validUrls.length > 0) {
              uploadPromises.push(uploadImageUrlsToCloudinary(savedProduct.id, validUrls));
            }
            
            await Promise.all(uploadPromises);
            alert('Tạo sản phẩm và upload hình ảnh thành công!');
          } catch (error) {
            console.error('Error uploading images:', error);
            alert('Sản phẩm đã được tạo nhưng upload hình ảnh thất bại: ' + error.message);
          } finally {
            setUploadingImage(false);
          }
        } else {
          alert('Tạo sản phẩm thành công!');
        }
      }

      setShowProductModal(false);
      if (onRefresh) onRefresh();
      if (onUpdateStats) onUpdateStats();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi khi lưu sản phẩm: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Xóa sản phẩm thành công!');
        if (onRefresh) onRefresh();
        if (onUpdateStats) onUpdateStats();
      } else {
        alert('Lỗi khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Lỗi khi xóa sản phẩm');
    }
  };

  return (
    <>
      <div className="flex-w flex-sb-m p-b-30">
        <h2 className="mtext-109 cl2">Quản lý sản phẩm</h2>
        <div className="flex-w" style={{ gap: '10px' }}>
          <button
            onClick={handleCreateProduct}
            className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            <i className="fa fa-plus"></i>
            Thêm sản phẩm
          </button>
          <button
            onClick={onRefresh}
            className="flex-c-m stext-101 cl0 bor14 hov-btn3 trans-04 pointer"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            <i className="fa fa-refresh"></i>
            Làm mới
          </button>
        </div>
      </div>
      
      <div className="bor10 bg-white">
        <div className="table-responsive">
          <table className="table">
            <thead className="bg-light">
              <tr>
                <th className="stext-111 cl6 p-lr-15 p-tb-15">ID</th>
                <th className="stext-111 cl6">Hình ảnh</th>
                <th className="stext-111 cl6">Tên sản phẩm</th>
                <th className="stext-111 cl6">SKU</th>
                <th className="stext-111 cl6">Giá</th>
                <th className="stext-111 cl6">Số lượng</th>
                <th className="stext-111 cl6">Trạng thái</th>
                <th className="stext-111 cl6">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-tb-30">
                    <p className="stext-111 cl6">Đang tải dữ liệu...</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="stext-110 cl2 p-lr-15 p-tb-15">#{product.id}</td>
                    <td className="p-lr-15 p-tb-15">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].imageUrl} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fa fa-image cl6"></i>
                        </div>
                      )}
                    </td>
                    <td className="stext-110 cl2">{product.name}</td>
                    <td className="stext-111 cl6">{product.sku}</td>
                    <td className="stext-110" style={{ color: '#e65540' }}>
                      {formatCurrency(product.price || 0)}
                    </td>
                    <td className="stext-111 cl6">{product.stockQty || product.stock || 0}</td>
                    <td>
                      <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="stext-111 text-primary m-r-10"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        title="Sửa"
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="stext-111 text-danger"
                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        title="Xóa"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <div className="modal-dialog" style={{ maxWidth: '500px', margin: '30px auto', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowProductModal(false)}
                  style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">SKU *</label>
                  <input
                    type="text"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="Mã SKU"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Tên sản phẩm *</label>
                  <input
                    type="text"
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Tên sản phẩm"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Mô tả</label>
                  <textarea
                    className="form-control bor8 p-lr-15 p-tb-10"
                    rows="2"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Mô tả sản phẩm"
                  />
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Danh mục</label>
                  <select
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group p-b-15">
                      <label className="stext-111 cl6">Giá *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control bor8 p-lr-15 p-tb-10"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="Giá"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group p-b-15">
                      <label className="stext-111 cl6">Số lượng *</label>
                      <input
                        type="number"
                        className="form-control bor8 p-lr-15 p-tb-10"
                        value={productForm.stockQty}
                        onChange={(e) => setProductForm({ ...productForm, stockQty: e.target.value })}
                        placeholder="Số lượng"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Trạng thái</label>
                  <select
                    className="form-control bor8 p-lr-15 p-tb-10"
                    value={productForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.value === 'true' })}
                  >
                    <option value="true">Đang bán</option>
                    <option value="false">Ngừng bán</option>
                  </select>
                </div>
                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Hình ảnh sản phẩm - Upload File</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="form-control bor8 p-lr-15 p-tb-10"
                  />
                  <small className="stext-111 cl6">Chọn một hoặc nhiều hình ảnh (JPG, PNG - Tối đa 5MB mỗi file)</small>
                  
                  {/* Preview uploaded images */}
                  {previewImages.length > 0 && (
                    <div className="p-t-15">
                      <div className="flex-w flex-wrap">
                        {previewImages.map((preview, index) => (
                          <div key={index} style={{ position: 'relative', margin: '5px', display: 'inline-block' }}>
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`} 
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImagePreview(index)}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                              title="Xóa"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group p-b-15">
                  <label className="stext-111 cl6">Hình ảnh sản phẩm - Dán Link</label>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex-w p-b-10" style={{ alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-control bor8 p-lr-15 p-tb-10"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="Dán link hình ảnh từ website"
                        style={{ flex: 1, marginRight: '10px' }}
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrlField(index)}
                          className="btn btn-danger"
                          style={{ minWidth: '40px' }}
                          title="Xóa"
                        >
                          <i className="fa fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrlField}
                    className="btn btn-secondary"
                    style={{ marginTop: '5px' }}
                  >
                    <i className="fa fa-plus m-r-5"></i>
                    Thêm link khác
                  </button>
                  <small className="stext-111 cl6" style={{ display: 'block', marginTop: '5px' }}>
                    Dán link hình ảnh từ website (hỗ trợ nhiều link)
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProductModal(false)}
                  disabled={uploadingImage}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveProduct}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <i className="fa fa-spinner fa-spin m-r-5"></i>
                      Đang upload...
                    </>
                  ) : (
                    editingProduct ? 'Cập nhật' : 'Tạo mới'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCRUD;

