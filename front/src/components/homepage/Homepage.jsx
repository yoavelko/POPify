import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pic1 from "../../../media/pic1.jpeg";
import pic2 from "../../../media/pic2.png";
import pic3 from "../../../media/pic3.jpeg";
import './Homepage.css';

const App = () => {
  const settings = {
    dots: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: (
        <div className="next-slick-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="white" height="24" viewBox="0 -960 960 960" width="24">
                <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/>
            </svg>
        </div>
    ),
    prevArrow: (
        <div className="prev-slick-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" stroke="white" height="24" viewBox="http://www.w3.org/2000/svg" width="24">
                <path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/>
            </svg>
        </div>
    ),
    responsive: [
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            },
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            },
        },
    ]
  };

  return (
    <div className="homepage">
      <Slider {...settings}>
        <div>
          <img src={pic1} alt="Slide 1" />
        </div>
        <div>
          <img src={pic2} alt="Slide 2" />
        </div>
        <div>
          <img src={pic3} alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
};

export default App;
