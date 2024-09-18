import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import pic1 from '../../media/pic1.png';
import pic2 from '../../media/pic2.png';
import pic3 from '../../media/pic3.png';
import pic4 from '../../media/pic4.png';


const MyCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={pic1}
          alt="Wild Landscape"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={pic2}
          alt="Camera"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={pic3}
          alt="Exotic Fruits"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={pic4}
          alt="Exotic Fruits"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default MyCarousel;
