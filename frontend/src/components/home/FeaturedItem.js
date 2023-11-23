import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedItem.css";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

function FeaturedItem() {
  return (
    <section style={{ display: "flex", gap: 10 }}>
      <section style={{ width: 700, height: 450 }}>
        <Swiper
          navigation={true}
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 1500, disableOnInteraction: true }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          <SwiperSlide
            className="slide-item"
            style={{
              backgroundImage: "url(/assets/sample/featured/image1.webp)",
            }}
          ></SwiperSlide>
          <SwiperSlide
            className="slide-item"
            style={{
              backgroundImage: "url(/assets/sample/featured/image2.webp)",
            }}
          ></SwiperSlide>
          <SwiperSlide
            className="slide-item"
            style={{
              backgroundImage: "url(/assets/sample/featured/image2.jpeg)",
            }}
          ></SwiperSlide>
          <SwiperSlide
            className="slide-item"
            style={{
              backgroundImage: "url(/assets/sample/featured/image4.jpeg)",
            }}
          ></SwiperSlide>
        </Swiper>

        <div id="item-name">
          <span>1967 Vintage Omega Speedmaster Watch</span>
        </div>
      </section>
      <section>
        <div id="item-description">
          <span>
            <p>
              Seller: <br />
              Morgan F.
            </p>
            <p>
              Current Bid: <br />
              $7,300
            </p>
            <p>
              Increment: <br />
              <span style={{ color: "#32de84" }}>+$100</span>
            </p>
            <p>
              Starting Bid: <br />
              $5000
            </p>
            <p>
              Time Left: <br />
              <span style={{ color: "#e63946" }}>3 days 12h</span>
            </p>
            <p>
              Bids: <br />
              15
            </p>
            <p>
              Subscribers: <br />
              17
            </p>
          </span>
        </div>
      </section>
    </section>
  );
}

export default FeaturedItem;
