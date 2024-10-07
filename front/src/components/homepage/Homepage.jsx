import { Link } from "react-router-dom"
import { useEffect, useState } from 'react'
import Login from "../login/Login"
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
export default Homepage