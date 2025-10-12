import React, { useState } from "react";
import "../../css/main.css";
import "../../css/util.css";
import "../../fonts/iconic/css/material-design-iconic-font.min.css";

export default function BlogSidebar({ featuredProducts, categories, archives, tags }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Add search logic here
  };

  return (
    <div className="side-menu">
      {/* Search */}
      <div className="bor17 of-hidden pos-relative">
        <input
          className="stext-103 cl2 plh4 size-116 p-l-28 p-r-55"
          type="text"
          name="search"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="flex-c-m size-122 ab-t-r fs-18 cl4 hov-cl1 trans-04"
          onClick={handleSearch}
        >
          <i className="zmdi zmdi-search"></i>
        </button>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="p-t-55">
          <h4 className="mtext-112 cl2 p-b-33">Categories</h4>
          <ul>
            {categories.map((category, index) => (
              <li key={index} className="bor18">
                <a
                  href="#"
                  className="dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4"
                  onClick={(e) => e.preventDefault()}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <div className="p-t-65">
          <h4 className="mtext-112 cl2 p-b-33">Featured Products</h4>
          <ul>
            {featuredProducts.map((product, index) => (
              <li key={index} className="flex-w flex-t p-b-30">
                <a
                  href="#"
                  className="wrao-pic-w size-214 hov-ovelay1 m-r-20"
                  onClick={(e) => e.preventDefault()}
                >
                  <img src={product.image} alt={product.name} />
                </a>
                <div className="size-215 flex-col-t p-t-8">
                  <a 
                    href="#" 
                    className="stext-116 cl8 hov-cl1 trans-04"
                    onClick={(e) => e.preventDefault()}
                  >
                    {product.name}
                  </a>
                  <span className="stext-116 cl6 p-t-20">${product.price}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Archive */}
      {archives && archives.length > 0 && (
        <div className="p-t-55">
          <h4 className="mtext-112 cl2 p-b-20">Archive</h4>
          <ul>
            {archives.map((archive, index) => (
              <li key={index} className="p-b-7">
                <a
                  href="#"
                  className="flex-w flex-sb-m stext-115 cl6 hov-cl1 trans-04 p-tb-2"
                  onClick={(e) => e.preventDefault()}
                >
                  <span>{archive.month}</span>
                  <span>({archive.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="p-t-50">
          <h4 className="mtext-112 cl2 p-b-27">Tags</h4>
          <div className="flex-w m-r--5">
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

