import "../../css/main.css";
import "../../css/util.css";
import "../../fonts/iconic/css/material-design-iconic-font.min.css";
import bgImage from "../../images/bg-01.jpg";
import about1 from "../../images/about-01.jpg";
import about2 from "../../images/about-02.jpg";
export default function About() {
  return (
    <div>
      {/* Title Pages */}
      <section
        className="bg-img1 txt-center p-lr-15 p-tb-92"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <h2 className="ltext-105 cl0 txt-center">About</h2>
      </section>

      {/* Content Pages */}
      <section className="bg0 p-t-75 p-b-120">
        <div className="container">
          <div className="row p-b-148">
            <div className="col-md-7 col-lg-8">
              <div className="p-t-7 p-r-85 p-r-15-lg p-r-0-md">
                <h3 className="mtext-111 cl2 p-b-16">Our Story</h3>

                <p className="stext-113 cl6 p-b-26">
                  Tại COZY, chúng tôi tin rằng thời trang không chỉ là những món
                  đồ bạn mặc mỗi ngày, mà còn là cách bạn thể hiện phong cách,
                  cá tính và cảm xúc của chính mình. Mỗi chiếc áo, chiếc quần
                  đều được chọn lựa kỹ lưỡng từ chất liệu đến đường may, nhằm
                  mang đến cho bạn sự thoải mái, tự tin và nổi bật trong mọi
                  hoàn cảnh. Dù bạn là người yêu phong cách tối giản, trẻ trung
                  năng động hay thích sự phá cách độc đáo, chúng tôi luôn có
                  những thiết kế phù hợp để bạn tự do thể hiện bản thân.
                </p>

                <p className="stext-113 cl6 p-b-26">
                  Không chỉ đơn thuần là nơi bán quần áo, COZY mong muốn trở
                  thành người bạn đồng hành cùng bạn trên hành trình định hình
                  phong cách sống. Chúng tôi hiểu rằng mỗi cá nhân đều có câu
                  chuyện riêng, và thời trang chính là ngôn ngữ giúp kể nên câu
                  chuyện ấy.
                </p>

                <p className="stext-113 cl6 p-b-26">
                  Any questions? Let us know in store at FPT University, Hoa
                  Lac, Ha Noi, VN 10018 or call us on (+1) 96 716 6879
                </p>
              </div>
            </div>

            <div className="col-11 col-md-5 col-lg-4 m-lr-auto">
              <div className="how-bor1">
                <div className="hov-img0">
                  <img src={about1} alt="IMG" />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="order-md-2 col-md-7 col-lg-8 p-b-30">
              <div className="p-t-7 p-l-85 p-l-15-lg p-l-0-md">
                <h3 className="mtext-111 cl2 p-b-16">Our Mission</h3>

                <p className="stext-113 cl6 p-b-26">
                  Với sứ mệnh “Tự tin với phong cách của bạn”, COZY luôn không
                  ngừng cập nhật những xu hướng mới nhất từ trong nước và quốc
                  tế, kết hợp cùng đội ngũ thiết kế sáng tạo để mang đến những
                  sản phẩm thời trang chất lượng cao, bền đẹp và bắt kịp xu
                  hướng. Chúng tôi hướng đến việc tạo ra một không gian mua sắm
                  tiện lợi, thân thiện và đầy cảm hứng – nơi mọi người có thể dễ
                  dàng tìm thấy sản phẩm yêu thích và được phục vụ tận tâm nhất.
                  Dù bạn đang tìm kiếm một outfit dạo phố năng động, một set đồ
                  thanh lịch nơi công sở, hay một phong cách riêng biệt cho buổi
                  hẹn cuối tuần, chúng tôi luôn sẵn sàng giúp bạn tỏa sáng. Hãy
                  để COZY giúp bạn tự tin thể hiện phong cách riêng trong từng
                  khoảnh khắc của cuộc sống.
                </p>

                <div className="bor16 p-l-29 p-b-9 m-t-22">
                  <p className="stext-114 cl6 p-r-40 p-b-11">
                    Creativity is just connecting things. When you ask creative
                    people how they did something, they feel a little guilty
                    because they didn't really do it, they just saw something.
                    It seemed obvious to them after a while.
                  </p>

                  <span className="stext-111 cl8">- Steve Job's</span>
                </div>
              </div>
            </div>

            <div className="order-md-1 col-11 col-md-5 col-lg-4 m-lr-auto p-b-30">
              <div className="how-bor2">
                <div className="hov-img0">
                  <img src={about2} alt="IMG" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
