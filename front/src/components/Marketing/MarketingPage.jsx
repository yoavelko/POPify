import React from "react";
import Slider from "../Gallery/Slider";  // ייבוא הגלריה הקיימת
import "./MarketingPage.css"; // ייבוא עיצוב
import pic from '../../media/fire.png';
import pic5 from '../../media/pic5.png';
import pic7 from '../../media/pic7.png'

const products = [
  {
    name: "Funko Pop! Marvel",
    imageUrl: "/images/funko_marvel.jpg",
    price: 85,
  },
  {
    name: "Funko Pop! Star Wars",
    imageUrl: "/images/funko_starwars.jpg",
    price: 90,
  },
  {
    name: "Funko Pop! Disney",
    imageUrl: "/images/funko_disney.jpg",
    price: 95,
  },
];

function MarketingPage() {
    return (
      <div className="marketing-page">
  
        <section className="main-banner">
          <div className="banner-content">
            <img src={pic7} alt="Gyutaro" className="banner-image" />
            <div className="banner-info">
              <span className="exclusive-label">Exclusive!</span>
              <h1>POP! Gyutaro (Blood Attack)</h1>
              <p>Bring new fighting styles into your Demon Slayer collection with this exclusive collectible.</p>
            </div>
          </div>
        </section>
        <Slider />
        <section className="sub-banners">
          <div className="sub-banner red-banner">
            <div className="sub-banner-info">
              <h2>Flip It & Reverse It</h2>
              <p>Collectibles from the Upside Down.</p>
            </div>
            <img src={pic} alt="Upside Down" className="sub-banner-image" />
          </div>
          <div className="sub-banner dark-banner">
            <div className="sub-banner-info">
              <h2>Oh, The Horror</h2>
              <p>Face your fears with our Funkoween set.</p>
            </div>
            <img src={pic5} alt="Horror" className="sub-banner-image-2" />
          </div>
        </section>
  
      </div>
    );
  }
  
  export default MarketingPage;