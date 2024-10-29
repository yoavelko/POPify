import { useEffect, useState } from 'react';
import ProductBox from "../productBox/ProductBox";
import './Homepage.css';
import cookies from 'js-cookie';
import { getProducts } from '../../utils/UserRoutes';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

function Homepage() {
    const [data, setData] = useState([]);
    const { query = "" } = useUser(); // בדיקה אם query מוגדר, אחרת ברירת מחדל ל-""

    useEffect(() => {
        if (!cookies.get("userId")) {
            cookies.set("userId", "66c46ef308d0fc505a69fefc", { expires: 7 });
        }
        if (!cookies.get("products")) {
            axios
                .get(getProducts)
                .then((res) => {
                    console.log('Response data:', res.data);
                    console.log('Products:', res.data.products);
                    setData(res.data.products || []); // ערך ברירת מחדל ל-data
                    cookies.set("products", JSON.stringify(res.data.products || []), { expires: 7 });
                })
                .catch((err) => {
                    console.log('Error:', err);
                });
        } else {
            const products = JSON.parse(cookies.get("products"));
            setData(products || []);
        }
    }, []);

    // מסנן את המוצרים לפי מילות החיפוש רק אם query הוא מחרוזת
    const filteredProducts = Array.isArray(data)
        ? data.filter(item => item.name && item.name.toLowerCase().includes(query.toLowerCase()))
        : [];

    return (
        <div>
            <div id="homepage-container">
                <div className="products-container">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((value, index) => (
                            <ProductBox key={index} value={value} />
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
