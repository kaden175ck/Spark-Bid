import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./FeaturedItem.css";
import PropTypes from "prop-types";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { formatDateForLocal, getPublicUrl, toUTCFormat } from "../../lib/utils";

function FeaturedItem({ listing, bids, users }) {
  const highest_bid = bids.reduce(
    (max, bid) => (bid.amount > max.amount ? bid : max),
    bids[0]
  );

  const listing_user = users[listing.user_id];

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Function to calculate time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const finishTime = new Date(formatDateForLocal(listing.finish_at));
      const difference = finishTime - now;

      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    // Update the time left immediately and every second
    const updateTimer = () => {
      const time = calculateTimeLeft();
      const formattedTime = `${time.days || 0}d ${time.hours || 0}h ${
        time.minutes || 0
      }m ${time.seconds || 0}s`;
      setTimeLeft(formattedTime);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [listing.finish_at]);

  if (!listing) return <div>Missing listing...</div>;
  if (!bids) return <div>Missing bids...</div>;
  if (!users) return <div>Missing users...</div>;
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
          {(listing.image_ids ?? []).map((image_id, index) => (
            <SwiperSlide key={index} className="slide-item">
              <img
                className="swiper-slide-img"
                src={getPublicUrl(listing.user_id, image_id)}
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
              <span style={{ color: "var(--error)" }}>{timeLeft}</span>
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
