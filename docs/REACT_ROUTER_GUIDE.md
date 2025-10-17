# 🚀 React Router - Hướng dẫn sử dụng

## ✅ Đã setup hoàn thành!

Bạn giờ có thể điều hướng giữa các trang bằng cách click vào menu!

---

## 📋 **Routes đã cấu hình:**

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/` | HomePage | Trang chủ (Slider + Banner + Products) |
| `/products` | ProductsPage | Trang danh sách sản phẩm |
| `/about` | About | Trang giới thiệu |
| `/login` | Login | Trang đăng nhập |
| `/signup` | Signup | Trang đăng ký |

---

## 🎯 **Cách hoạt động:**

### 1. **NavBar với Link**

```jsx
// frontend/src/components/Pages/NavBar.jsx
import { Link } from "react-router-dom";

<ul className="main-menu">
  <li><Link to="/">Home</Link></li>
  <li><Link to="/products">Shop</Link></li>
  <li><Link to="/about">About</Link></li>
</ul>
```

**Khi click vào "About":**
- URL thay đổi: `localhost:3000` → `localhost:3000/about`
- Trang **KHÔNG reload** (Single Page Application)
- Component `<About />` được render

---

### 2. **App.js với Routes**

```jsx
// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <NavBar />
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
  </Routes>
  <Footer />
</Router>
```

**Giải thích:**
- `<Router>` - Bọc toàn bộ app
- `<Routes>` - Chứa tất cả các route
- `<Route path="/about" element={<About />}` - Khi URL là `/about`, hiển thị component `About`

---

## 🔗 **Link vs <a> tag**

### ❌ **Không dùng `<a>` (Sẽ reload trang):**
```jsx
<a href="/about">About</a>  // ← Reload toàn bộ trang!
```

### ✅ **Dùng `<Link>` (Không reload):**
```jsx
import { Link } from "react-router-dom";

<Link to="/about">About</Link>  // ← Chuyển trang mượt mà!
```

**Ưu điểm Link:**
- ✅ Không reload trang
- ✅ Giữ nguyên state
- ✅ Nhanh hơn
- ✅ Trải nghiệm tốt hơn (SPA)

---

## 📚 **Các cách điều hướng:**

### 1. **Link (Thông thường)**
```jsx
<Link to="/about">About</Link>
```

### 2. **NavLink (Có active state)**
```jsx
import { NavLink } from "react-router-dom";

<NavLink 
  to="/about" 
  className={({ isActive }) => isActive ? "active" : ""}
>
  About
</NavLink>
```

### 3. **Programmatic Navigation (Trong code)**
```jsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/about');  // Chuyển đến /about
  };
  
  return <button onClick={handleClick}>Go to About</button>;
}
```

---

## 🎨 **Ví dụ thực tế:**

### Scenario 1: Click vào About từ Home

**Bước 1:** User click vào "About" trong menu
```jsx
<Link to="/about">About</Link>
```

**Bước 2:** URL thay đổi
```
localhost:3000  →  localhost:3000/about
```

**Bước 3:** React Router matching
```jsx
<Route path="/about" element={<About />} />
```

**Bước 4:** Component About được render
```jsx
function About() {
  return <div>Trang About...</div>;
}
```

---

### Scenario 2: Click Sign In từ NavBar

**Bước 1:** User click "Sign In"
```jsx
<Link to="/login">Sign In</Link>
```

**Bước 2:** Chuyển đến `/login`
```jsx
<Route path="/login" element={<Login />} />
```

**Bước 3:** User thấy form login

**Bước 4:** User click "Đăng ký ngay"
```jsx
<Link to="/signup">Đăng ký ngay</Link>
```

**Bước 5:** Chuyển đến `/signup`

---

## 🛠️ **Thêm route mới:**

### Bước 1: Tạo component
```jsx
// frontend/src/components/Pages/Contact.jsx
export default function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Email: contact@shop.com</p>
    </div>
  );
}
```

### Bước 2: Import và thêm route
```jsx
// frontend/src/App.js
import Contact from './components/Pages/Contact';

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />  {/* ← Mới */}
</Routes>
```

### Bước 3: Thêm Link trong NavBar
```jsx
// frontend/src/components/Pages/NavBar.jsx
<li><Link to="/contact">Contact</Link></li>
```

**Xong! Giờ có route `/contact`** ✅

---

## 🔧 **Route Parameters (Dynamic Routes):**

### Ví dụ: Chi tiết sản phẩm

```jsx
// App.js
<Route path="/products/:id" element={<ProductDetail />} />

// ProductDetail.jsx
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();  // Lấy id từ URL
  
  return <div>Product ID: {id}</div>;
}

// Link đến product
<Link to="/products/123">View Product 123</Link>
```

**URL:** `localhost:3000/products/123`  
**Result:** `id = "123"`

---

## 🎯 **Nested Routes (Routes lồng nhau):**

```jsx
<Route path="/products" element={<ProductsLayout />}>
  <Route index element={<ProductsList />} />
  <Route path=":id" element={<ProductDetail />} />
  <Route path="new" element={<NewProduct />} />
</Route>
```

**URLs:**
- `/products` → ProductsList
- `/products/123` → ProductDetail
- `/products/new` → NewProduct

---

## 🔒 **Protected Routes (Route bảo vệ):**

```jsx
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Sử dụng
<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } 
/>
```

---

## 📝 **Best Practices:**

### 1. **Tổ chức Routes**
```jsx
// routes.js
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
];

// App.js
{routes.map(route => (
  <Route key={route.path} {...route} />
))}
```

### 2. **Layout Component**
```jsx
function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />  {/* Render child routes */}
      <Footer />
    </>
  );
}

<Route path="/" element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path="about" element={<About />} />
</Route>
```

### 3. **404 Page**
```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />  {/* Catch all */}
</Routes>
```

---

## ⚡ **Useful Hooks:**

### 1. **useNavigate** - Điều hướng trong code
```jsx
const navigate = useNavigate();
navigate('/about');
navigate(-1);  // Go back
```

### 2. **useLocation** - Lấy thông tin URL hiện tại
```jsx
const location = useLocation();
console.log(location.pathname);  // '/about'
```

### 3. **useParams** - Lấy params từ URL
```jsx
const { id } = useParams();
```

### 4. **useSearchParams** - Query string
```jsx
const [searchParams] = useSearchParams();
const query = searchParams.get('q');  // ?q=react
```

---

## 🐛 **Troubleshooting:**

### Lỗi: "Cannot GET /about" khi refresh
**Nguyên nhân:** Server không biết route `/about`

**Giải pháp:** Config server trả về `index.html` cho mọi routes

**Create React App (development):** Tự động xử lý ✅

**Production (nginx):**
```nginx
location / {
  try_files $uri /index.html;
}
```

---

### Lỗi: Link không hoạt động
**Kiểm tra:**
1. ✅ Import Link từ `react-router-dom`
2. ✅ App được bọc bởi `<Router>`
3. ✅ Route đã được define trong `<Routes>`

---

## 🎉 **Tóm tắt:**

### ✅ Đã setup:
- Router trong App.js
- Link trong NavBar
- Routes cho các trang chính
- Link giữa Login ↔ Signup

### 🚀 Kết quả:
- Click "About" → Chuyển sang trang About
- Click "Shop" → Chuyển sang trang Products
- Click "Sign In" → Chuyển sang trang Login
- **Không reload trang!**

---

## 📖 **Tài liệu tham khảo:**

- [React Router Official Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

---

**Happy Routing! 🎉**



