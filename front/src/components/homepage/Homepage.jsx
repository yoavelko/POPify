import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import Login from "../login/Login"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pic1 from "../../../media/pic1.png"
import pic2 from "../../../media/pic2.png"
import pic3 from "../../../media/pic3.png"
import './Homepage.css'

const App = () =>{
    const settings = {
        dots: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: (
            <div>
              <div className="next-slick-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
              </div>
            </div>
          ),
      
          prevArrow: (
            <div>
              <div className="next-slick-arrow rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" stroke="black" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
              </div>
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
        <div>
import Loader from "../loader/Loader"
import ProductBox from "../productBox/ProductBox"
import './Homepage.css'
import cookies from 'js-cookie';
import { getProducts } from '../../utils/UserRoutes';
import axios from 'axios';

function Homepage() {

    const [data, setData] = useState();

    useEffect(() => {
        if (!cookies.get("userId")) {
            cookies.set("userId", "66c46ef308d0fc505a69fefc", { expires: 7 })
        }
        if (!cookies.get("products")) {
            axios
                .get(getProducts)
                .then((res) => {
                    console.log('Response data:', res.data);
                    console.log('Products:', res.data.products);
                    setData(res.data.products);
                    cookies.set("products", JSON.stringify(res.data.products), { expires: 7 });
                })
                .catch((err) => {
                    console.log('Error:', err);
                });
        } else {
            // If products are already in cookies, load them
            const products = JSON.parse(cookies.get("products"));
            setData(products);
        }
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <div id="homepage-container">
            <Link to={'/login'}>to login</Link>
            <div className="products-container">
                {data && data ? (
                    data.map((value, index) => (
                        <ProductBox key={index} value={value} />
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
        </div>
    )
}

          <Slider {...settings}>
            <div>
            <img className="img-body" src={pic1} />
            </div>
            <div>
            <img className="img-body"src={pic2} />
            </div>
            <div>
            <img className="img-body" src={pic3} />
            </div>
          </Slider>
        </div>
      );
      
    };
    
    export default App;
