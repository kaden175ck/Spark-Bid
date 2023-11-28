import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';
import "./BidFeature.css"
import { Navigation, Autoplay } from "swiper/modules";

const BidFeature = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <section className='item-container'>

            <section className='info'>
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
            </section>
            <Swiper
                navigation={true}
                className='top-swiper'
                modules={[Navigation, Autoplay, Thumbs]}
                thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: true }}

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

            <Swiper
                slidesPerView={4}
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                className="thumbs"
                spaceBetween={10}
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
        {/* Main Swiper -> pass thumbs swiper instance */}

        
      </section>
    
    );
}

export default BidFeature;
