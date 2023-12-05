import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedItem.css";
import PropTypes from "prop-types";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

function FeaturedItem({ listing, bids, users }) {
  if (!listing) return <div>Missing listing...</div>;
  if (!bids) return <div>Missing bids...</div>;
  if (!users) return <div>Missing users...</div>;

  const highest_bid = bids.reduce(
    (max, bid) => (bid.amount > max.amount ? bid : max),
    bids[0]
  );

  const listing_user = users[listing.user_id];

  return (
    <section style={{ display: "flex", gap: 10 }}>
      <section style={{ width: 700, height: 450 }}>
        <Swiper
          navigation={true}
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {listing.images.map((image, index) => (
            <SwiperSlide key={index} className="slide-item">
              <img
                className="swiper-slide-img"
                src={image}
                alt={`Slide ${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div id="item-name">
          <span>{listing.title}</span>
        </div>
      </section>
      <section>
        <div id="item-description">
          <span>
            <p>
              Seller: <br />
              {listing_user?.name ?? "Unknown User"}
            </p>
            <p>
              Current Bid: <br />
              {highest_bid ? `$${highest_bid.amount}` : "No bids"}
            </p>
            <p>
              Increment: <br />
              <span style={{ color: "var(--success)" }}>
                +${listing.increment}
              </span>
            </p>
            <p>
              Starting Bid: <br />
              <span style={{ color: "var(--success)" }}>
                ${listing.start_price}
              </span>
            </p>
            <p>
              Time Left: <br />
              <span style={{ color: "var(--error)" }}>
                {"{listing time left}"}
              </span>
            </p>
            <p>
              Bids: <br />
              {bids.length}
            </p>
            <p>
              Subscribers: <br />
              {"{listing number of subscribers}"}
            </p>
          </span>
        </div>
      </section>
    </section>
  );
}

FeaturedItem.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default FeaturedItem;
