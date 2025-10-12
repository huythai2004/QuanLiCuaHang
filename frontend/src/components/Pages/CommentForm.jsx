import React, { useState } from "react";
import "../../css/main.css";
import "../../css/util.css";

export default function CommentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    comment: "",
    name: "",
    email: "",
    website: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.comment.trim()) {
      alert("Please enter a comment");
      return;
    }
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Call parent onSubmit handler
    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form
    setFormData({
      comment: "",
      name: "",
      email: "",
      website: ""
    });

    // Show success message
    alert("Comment posted successfully!");
  };

  return (
    <div className="p-t-40">
      <h5 className="mtext-113 cl2 p-b-12">Leave a Comment</h5>
      <p className="stext-107 cl6 p-b-40">
        Your email address will not be published. Required fields are marked *
      </p>

      <form onSubmit={handleSubmit}>
        <div className="bor19 m-b-20">
          <textarea
            className="stext-111 cl2 plh3 size-124 p-lr-18 p-tb-15"
            name="comment"
            placeholder="Comment..."
            value={formData.comment}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>

        <div className="bor19 size-218 m-b-20">
          <input
            className="stext-111 cl2 plh3 size-116 p-lr-18"
            type="text"
            name="name"
            placeholder="Name *"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="bor19 size-218 m-b-20">
          <input
            className="stext-111 cl2 plh3 size-116 p-lr-18"
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="bor19 size-218 m-b-30">
          <input
            className="stext-111 cl2 plh3 size-116 p-lr-18"
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit"
          className="flex-c-m stext-101 cl0 size-125 bg3 bor2 hov-btn3 p-lr-15 trans-04"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}

