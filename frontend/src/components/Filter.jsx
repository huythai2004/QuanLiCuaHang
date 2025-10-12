import React, { useState } from "react";
import "../css/main.css";
import "../css/util.css";
import "../fonts/iconic/css/material-design-iconic-font.min.css";

export default function Filter({ onFilterChange }) {
  const [selectedSort, setSelectedSort] = useState("default");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "popularity", label: "Popularity" },
    { value: "rating", label: "Average rating" },
    { value: "newness", label: "Newness" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" }
  ];

  const priceRanges = [
    { value: "all", label: "All" },
    { value: "0-50", label: "$0.00 - $50.00" },
    { value: "50-100", label: "$50.00 - $100.00" },
    { value: "100-150", label: "$100.00 - $150.00" },
    { value: "150-200", label: "$150.00 - $200.00" },
    { value: "200+", label: "$200.00+" }
  ];

  const colors = [
    { value: "black", label: "Black", color: "#222" },
    { value: "blue", label: "Blue", color: "#4272d7" },
    { value: "grey", label: "Grey", color: "#b3b3b3" },
    { value: "green", label: "Green", color: "#00ad5f" },
    { value: "red", label: "Red", color: "#fa4251" },
    { value: "white", label: "White", color: "#aaa", outline: true }
  ];

  const tags = ["Fashion", "Lifestyle", "Denim", "Streetstyle", "Crafts"];

  const handleSortChange = (value) => {
    setSelectedSort(value);
    if (onFilterChange) {
      onFilterChange({ sort: value, price: selectedPrice, colors: selectedColors, tags: selectedTags });
    }
  };

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
    if (onFilterChange) {
      onFilterChange({ sort: selectedSort, price: value, colors: selectedColors, tags: selectedTags });
    }
  };

  const handleColorToggle = (value) => {
    const newColors = selectedColors.includes(value)
      ? selectedColors.filter(c => c !== value)
      : [...selectedColors, value];
    setSelectedColors(newColors);
    if (onFilterChange) {
      onFilterChange({ sort: selectedSort, price: selectedPrice, colors: newColors, tags: selectedTags });
    }
  };

  const handleTagToggle = (value) => {
    const newTags = selectedTags.includes(value)
      ? selectedTags.filter(t => t !== value)
      : [...selectedTags, value];
    setSelectedTags(newTags);
    if (onFilterChange) {
      onFilterChange({ sort: selectedSort, price: selectedPrice, colors: selectedColors, tags: newTags });
    }
  };

  return (
    <div className="panel-filter w-full p-t-10">
      <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
        {/* Sort By */}
        <div className="filter-col1 p-r-15 p-b-27">
          <div className="mtext-102 cl2 p-b-15">Sort By</div>
          <ul>
            {sortOptions.map((option) => (
              <li key={option.value} className="p-b-6">
                <a
                  href="#"
                  className={`filter-link stext-106 trans-04 ${selectedSort === option.value ? "filter-link-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSortChange(option.value);
                  }}
                >
                  {option.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div className="filter-col2 p-r-15 p-b-27">
          <div className="mtext-102 cl2 p-b-15">Price</div>
          <ul>
            {priceRanges.map((range) => (
              <li key={range.value} className="p-b-6">
                <a
                  href="#"
                  className={`filter-link stext-106 trans-04 ${selectedPrice === range.value ? "filter-link-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePriceChange(range.value);
                  }}
                >
                  {range.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Color */}
        <div className="filter-col3 p-r-15 p-b-27">
          <div className="mtext-102 cl2 p-b-15">Color</div>
          <ul>
            {colors.map((color) => (
              <li key={color.value} className="p-b-6">
                <span className="fs-15 lh-12 m-r-6" style={{ color: color.color }}>
                  <i className={`zmdi zmdi-circle${color.outline ? "-o" : ""}`}></i>
                </span>
                <a
                  href="#"
                  className={`filter-link stext-106 trans-04 ${selectedColors.includes(color.value) ? "filter-link-active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleColorToggle(color.value);
                  }}
                >
                  {color.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="filter-col4 p-b-27">
          <div className="mtext-102 cl2 p-b-15">Tags</div>
          <div className="flex-w p-t-4 m-r--5">
            {tags.map((tag) => (
              <a
                key={tag}
                href="#"
                className={`flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5 ${
                  selectedTags.includes(tag) ? "tag-active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTagToggle(tag);
                }}
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}