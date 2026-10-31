import React from 'react';
import { Link } from 'react-router-dom';
import { networks } from '../data/cartoons';
import { Tv, ArrowRight } from 'lucide-react';
import './NetworksPage.css';

const networkDescriptions = {
  'cartoon-network': 'The legendary home of Dexter, Ben 10, Powerpuff Girls, Courage the Cowardly Dog, and classic animation masterpieces.',
  'disney': 'The magical kingdom of Phineas & Ferb, Gravity Falls, The Owl House, DuckTales, and timeless story-driven adventures.',
  'nickelodeon': 'Iconic orange splat home of SpongeBob SquarePants, Avatar: The Last Airbender, Teenage Mutant Ninja Turtles, and rugrats.',
  'pogo': 'India’s beloved kids channel featuring Chhota Bheem, Mighty Raju, Takeshi’s Castle, and festive adventures.',
  'hungama': 'Non-stop laughter and sci-fi comedy with Doraemon, Shinchan, Perman, and Ninja Hattori.',
  'discovery-kids': 'Exciting mystery, adventure, and curiosity-driven cartoons like Little Singham and adventurous expeditions.',
};

function NetworksPage() {
  return (
    <div className="networks-page">
      <div className="container">
        <div className="networks-header">
          <div className="networks-title-badge">
            <Tv size={18} /> Official Broadcasting Hubs
          </div>
          <h1 className="networks-title">Explore Cartoon Networks</h1>
          <p className="networks-subtitle">
            Browse through legendary broadcast networks that shaped generations of animated television
          </p>
        </div>

        <div className="networks-grid">
          {networks.map((network) => (
            <Link
              key={network.id}
              to={`/network/${network.id}`}
              className="network-card"
              style={{ '--network-accent': network.color }}
            >
              <div className="network-card-border" />
              <img
                className="network-card-image"
                src={network.bannerImage}
                alt=""
                aria-hidden="true"
              />
              <div className="network-card-top">
                <span className="network-channel-badge">CHANNEL</span>
                <span className="network-shows-count">{network.cartoonCount}+ Titles</span>
              </div>

              <h2 className="network-card-name">{network.name}</h2>
              <p className="network-card-desc">
                {networkDescriptions[network.id] || 'Explore all available episodes, seasons and downloadable media.'}
              </p>

              <div className="network-card-footer">
                <span>View All Shows</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NetworksPage;
