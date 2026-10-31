import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { networks } from '../../data/cartoons';
import './NetworkCarousel.css';

const SCROLL_AMOUNT = 260;

function NetworkCarousel() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
        behavior: 'smooth',
      });
    }
  };

  const handleNetworkClick = (networkId) => {
    navigate(`/network/${networkId}`);
  };

  return (
    <section className="network-carousel">
      <div className="container">
        <div className="network-carousel__header">
          <h2 className="network-carousel__title">📡 Featured Cartoon Networks</h2>
          <span className="network-carousel__sub">Explore exclusive shows by network broadcast channel</span>
        </div>

        <div className="network-carousel__wrapper">
          <button
            className="network-carousel__arrow network-carousel__arrow--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div className="network-carousel__track" ref={scrollRef}>
            {networks.map((network) => (
              <div
                key={network.id}
                className="network-carousel__card"
                style={{ '--network-color': network.color }}
                onClick={() => handleNetworkClick(network.id)}
                title={`Explore ${network.name}`}
              >
                <div className="network-carousel__card-border" />
                <img
                  className="network-carousel__card-image"
                  src={network.bannerImage}
                  alt=""
                  aria-hidden="true"
                />
                <div className="network-carousel__card-badge">CHANNEL</div>
                <span className="network-carousel__card-name">{network.name}</span>
                <span className="network-carousel__card-count">
                  {network.cartoonCount}+ Cartoons
                </span>
              </div>
            ))}
          </div>

          <button
            className="network-carousel__arrow network-carousel__arrow--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default NetworkCarousel;
