import React from "react";
import "../css/main.css";
import "../css/util.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SearchProducts() {
  return (
    <div className="bg0 p-t-23 p-b-140">
      <div className="container">
        <div className="p-b-10">
          <h3 className="ltext-103 cl5">Products Overview</h3>
        </div>

        <div className="flex-w flex-sb-m p-b-52">
          <div className="flex-w flex-l-m filter-tope-group m-tb-10">
            <button
              className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 how-active1"
              data-filter="*"
            >
              All Products
            </button>

            {/* Women */}
            <button
              className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
              data-filter=".women"
            >
              Women
            </button>

            {/* Men */}
            <button
              className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
              data-filter=".men"
            >
              Men
            </button>

            {/* bag */}
            <button
              className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
              data-filter=".bag"
            >
              Bag
            </button>

            {/* Shoes */}
            <button
              className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
              data-filter=".shoes"
            >
              Shoes
            </button>

            {/* Watches */}
            <button
              className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
              data-filter=".watches"
            >
              Watches
            </button>
          </div>

          <div className="flex-w flex-c-m m-tb-10">
            <div className="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 js-show-filter">
              <i className="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"></i>
              <i class="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"></i>
              Filter
            </div>

            <div className="flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 js-show-search">
              <i class="icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search"></i>
              <i class="icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"></i>
              Search
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
