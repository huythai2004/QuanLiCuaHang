import React from "react";
import "../../css/main.css";
import "../../css/util.css";

export default function BlogContent({ blog }) {
  const {
    image,
    date,
    day,
    month,
    year,
    author = "Admin",
    categories = [],
    comments = 0,
    title,
    content,
    tags = []
  } = blog;

  return (
    <div>
      {/* Featured Image */}
      <div className="wrap-pic-w how-pos5-parent">
        <img src={image} alt="IMG-BLOG" />
        <div className="flex-col-c-m size-123 bg9 how-pos5">
          <span className="ltext-107 cl2 txt-center">{day}</span>
          <span className="stext-109 cl3 txt-center">
            {month} {year}
          </span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="p-t-32">
        <span className="flex-w flex-m stext-111 cl2 p-b-19">
          <span>
            <span className="cl4">By</span> {author}
            <span className="cl12 m-l-4 m-r-6">|</span>
          </span>

          <span>
            {date}
            <span className="cl12 m-l-4 m-r-6">|</span>
          </span>

          {categories.length > 0 && (
            <span>
              {categories.join(", ")}
              <span className="cl12 m-l-4 m-r-6">|</span>
            </span>
          )}

          <span>{comments} Comments</span>
        </span>

        {/* Title */}
        <h4 className="ltext-109 cl2 p-b-28">{title}</h4>

        {/* Content */}
        {Array.isArray(content) ? (
          content.map((paragraph, index) => (
            <p key={index} className="stext-117 cl6 p-b-26">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="stext-117 cl6 p-b-26">{content}</p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex-w flex-t p-t-16">
          <span className="size-216 stext-116 cl8 p-t-4">Tags</span>
          <div className="flex-w size-217">
            {tags.map((tag, index) => (
              <a
                key={index}
                href="#"
                className="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5"
                onClick={(e) => e.preventDefault()}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


