import React, { useState } from "react";
import "../../css/main.css";
import "../../css/util.css";
import "../../fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "../../fonts/iconic/css/material-design-iconic-font.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Components
import BlogContent from "./BlogContent";
import CommentForm from "./CommentForm";
import BlogSidebar from "./BlogSidebar";

// Import Images
import ImgBlog from "../../images/blog-04.jpg";
import ImgProduct from "../../images/product-min-01.jpg";
import ImgProduct2 from "../../images/product-min-02.jpg";
import ImgProduct3 from "../../images/product-min-03.jpg";

export default function BlogDetails() {
  // Blog data
  const [blogData] = useState({
    image: ImgBlog,
    day: "22",
    month: "Jan",
    year: "2025",
    date: "22 Jan, 2025",
    author: "Admin",
    categories: ["StreetStyle", "Fashion", "Couple"],
    comments: 8,
    title: "8 Inspiring Ways to Wear Dresses in the Winter",
    content: [
      `Tại COZY, chúng tôi luôn tin rằng thời trang không chỉ là xu hướng, mà là cách mỗi người kể câu chuyện của riêng mình. Mỗi sản phẩm được thiết kế và chọn lựa cẩn thận từ chất liệu đến từng đường kim mũi chỉ, nhằm mang lại cảm giác thoải mái, tự tin và phong cách cho người mặc. Chúng tôi không ngừng cập nhật các bộ sưu tập mới, kết hợp giữa sự tinh tế trong thiết kế và tính ứng dụng cao, giúp bạn dễ dàng lựa chọn trang phục phù hợp cho mọi dịp – từ đi làm, đi học cho đến dạo phố cùng bạn bè. Với chúng tôi, mỗi chiếc áo, chiếc quần đều mang trong mình giá trị của sự chỉn chu và đam mê sáng tạo.`,
      `Không chỉ dừng lại ở việc cung cấp những sản phẩm chất lượng, COZY còn hướng đến trải nghiệm mua sắm trọn vẹn cho khách hàng. Giao diện website thân thiện, thanh toán linh hoạt, cùng dịch vụ giao hàng nhanh chóng giúp bạn dễ dàng chọn lựa và nhận sản phẩm yêu thích ngay tại nhà. Chúng tôi luôn lắng nghe ý kiến của bạn để ngày càng hoàn thiện hơn, bởi niềm vui của bạn chính là động lực để chúng tôi tiếp tục sáng tạo. Hãy để COZY đồng hành cùng bạn trong hành trình khẳng định phong cách và biến mỗi ngày trở nên đặc biệt hơn.`,
    ],
    tags: ["Streetstyle", "Crafts"],
  });

  // Sidebar data
  const categories = [
    "Fashion",
    "Beauty",
    "Street Style",
    "Life Style",
    "DIY & Crafts",
  ];

  const featuredProducts = [
    {
      name: "White Shirt With Pleat Detail Back",
      price: "19.00",
      image: ImgProduct,
    },
    {
      name: "Converse All Star Hi Black Canvas",
      price: "39.00",
      image: ImgProduct2,
    },
    {
      name: "Nixon Porter Leather Watch In Tan",
      price: "17.00",
      image: ImgProduct3,
    },
  ];

  const archives = [
    { month: "July 2025", count: 9 },
    { month: "June 2025", count: 39 },
    { month: "May 2025", count: 29 },
    { month: "April 2025", count: 35 },
    { month: "March 2025", count: 22 },
    { month: "February 2025", count: 32 },
    { month: "January 2025", count: 21 },
    { month: "December 2024", count: 26 },
  ];

  const tags = ["Fashion", "Lifestyle", "Denim", "Streetstyle", "Crafts"];

  // Handle comment submission
  const handleCommentSubmit = (commentData) => {
    console.log("New comment:", commentData);
    // Here you can add API call to save comment
  };

  return (
    <div>
      {/* Content page */}
      <section className="bg0 p-t-52 p-b-20">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-md-8 col-lg-9 p-b-80">
              <div className="p-r-45 p-r-0-lg">
                <BlogContent blog={blogData} />
                <CommentForm onSubmit={handleCommentSubmit} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-md-4 col-lg-3 p-b-80">
              <BlogSidebar
                featuredProducts={featuredProducts}
                categories={categories}
                archives={archives}
                tags={tags}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
