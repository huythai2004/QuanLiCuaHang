import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/main.css";
import "../../css/util.css";
import "bootstrap/dist/css/bootstrap.min.css";
import slide01 from "../../images/slide-01.jpg";
import slide02 from "../../images/slide-02.jpg";
import slide03 from "../../images/slide-03.jpg";
import iconPrev from "../../images/icons/icon-prev.png";
import iconNext from "../../images/icons/icon-next.png";

export default function Slider() {
  const slickRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images first
  useEffect(() => {
    const imagePromises = [slide01, slide02, slide03].map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    });

    Promise.all(imagePromises).then(() => {
      console.log("All images loaded");
      setImagesLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const $slider = $(slickRef.current);

    // Cleanup before restart
    if ($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }

    // waiting to confirm DOM is Rendered
    setTimeout(() => {
      $slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        dots: true,
        arrows: false, // Tắt arrows mặc định, dùng nút custom
        dotsClass: "slick1-dots",
        customPaging: function (slick, index) {
          const slide = $(slick.$slides[index]);
          let linkImg = slide.attr("data-thumb");
          if (!linkImg) {
            linkImg = slide.find("img").attr("src") || "";
          }
          return (
            '<img src="' +
            linkImg +
            '" /><div class="slick1-dot-overlay"></div>'
          );
        },
        autoplay: true,
        autoplaySpeed: 6000,
        speed: 800,
      });

      // Animation when slide changed
      $slider.on("setPosition", function () {
        const currentSlide = $(this).find(".slick-current");
        $(".layer-slick1").removeClass("animated").addClass("visible-false");
        currentSlide.find(".layer-slick1").each(function (index) {
          const that = $(this);
          const delay = that.data("delay");
          const appear = that.data("appear");
          setTimeout(function () {
            that.removeClass("visible-false").addClass("animated " + appear);
          }, delay);
        });
      });

      // Trigger animation for first slide
      $slider.slick("setPosition");

      // Debug: Log background images
      console.log("Checking backgrounds:");
      $(".item-slick1").each(function (i) {
        const bgImage = $(this).css("background-image");
        console.log(`Slide ${i} background:`, bgImage);
      });
    }, 100);

    // Cleanup when unmount
    return () => {
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
      }
    };
  }, [imagesLoaded]);

  const handlePrevSlide = () => {
    if (slickRef.current) {
      const $slider = $(slickRef.current);
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("slickPrev");
      }
    }
  };

  const handleNextSlide = () => {
    if (slickRef.current) {
      const $slider = $(slickRef.current);
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("slickNext");
      }
    }
  };

  return (
    <div>
      <section className="section-slide" style={{ position: "relative" }}>
        {/* Custom Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className="slick-custom-prev"
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.7)",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.9)";
            e.target.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.7)";
            e.target.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <img
            src={iconPrev}
            alt="Previous"
            style={{ width: "24px", height: "24px" }}
          />
        </button>

        <button
          onClick={handleNextSlide}
          className="slick-custom-next"
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.7)",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.9)";
            e.target.style.transform = "translateY(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.7)";
            e.target.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <img
            src={iconNext}
            alt="Next"
            style={{ width: "24px", height: "24px" }}
          />
        </button>

        <div className="wrap-slick1">
          <div className="slick1" ref={slickRef}>
            {/* Slide 1 */}
            <div
              className="item-slick1"
              style={{
                backgroundImage: `url(${slide01})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              data-thumb={slide01}
            >
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="fadeInDown"
                    data-delay="0"
                  >
                    <span className="ltext-101 cl2 respon2">
                      Women Collection 2025
                    </span>
                  </div>
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="fadeInUp"
                    data-delay="800"
                  >
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                      NEW SEASON
                    </h2>
                  </div>
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="zoomIn"
                    data-delay="1600"
                  >
                    <a
                      href="product.html"
                      className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div
              className="item-slick1"
              style={{
                backgroundImage: `url(${slide02})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              data-thumb={slide02}
            >
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="rollIn"
                    data-delay="0"
                  >
                    <span className="ltext-101 cl2 respon2">
                      Men New-Season
                    </span>
                  </div>
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="lightSpeedIn"
                    data-delay="800"
                  >
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                      Jackets & Coats
                    </h2>
                  </div>
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="slideInUp"
                    data-delay="1600"
                  >
                    <a
                      href="product.html"
                      className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div
              className="item-slick1"
              style={{
                backgroundImage: `url(${slide03})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              data-thumb={slide03}
            >
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="rotateInDownLeft"
                    data-delay="0"
                  >
                    <span className="ltext-101 cl2 respon2">
                      Men Collection 2025
                    </span>
                  </div>
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="rotateInUpRight"
                    data-delay="800"
                  >
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                      New arrivals
                    </h2>
                  </div>
                  <div
                    className="layer-slick1 animated visible-false"
                    data-appear="rotateIn"
                    data-delay="1600"
                  >
                    <a
                      href="product.html"
                      className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="wrap-slick1-dots"></div>
        </div>
      </section>
    </div>
  );
}
