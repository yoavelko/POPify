import React, { useState, useEffect } from "react";
import ProductBox from "../productBox/ProductBox";
import './Homepage.css';
import { getProductsWithPopularity } from "../../utils/OrderRoutes";
import { useUser } from '../../context/UserContext';
import axios from 'axios';

function Homepage() {
  const { query } = useUser();
  const [products, setProducts] = useState([]);  // ערך התחלתי ריק למניעת שגיאה
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice] = useState("");
  const [maxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // ערך ברירת מחדל ל"none" כך שהמיון לא יהיה אוטומטי

  // שליפת מוצרים מהשרת כולל פופולריות
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(getProductsWithPopularity); // קריאה לנתיב בשרת שמחזיר את המוצרים עם כמות הרכישות
        setProducts(response.data || []); // בדיקת נתונים וערך ריק אם אין נתונים
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setProducts([]); // הגדרת products לערך ריק במקרה של שגיאה
      }
    };
    fetchProducts();
  }, []);

  // סינון ומיון מוצרים לפי קטגוריה, חיפוש, מחיר ופופולריות (כאשר נבחרה האפשרות)
  const filteredProducts = products
    .filter(item => 
      selectedCategory === "All" || item.category === selectedCategory
    )
    .filter(item =>
      item.name && item.name.toLowerCase().includes(query.toLowerCase())
    )
    .filter(item =>
      (minPrice === "" || item.price >= parseFloat(minPrice)) &&
      (maxPrice === "" || item.price <= parseFloat(maxPrice))
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      if (sortOrder === "popularity") return (b.purchaseCount || 0) - (a.purchaseCount || 0); // מיון לפי פופולריות רק אם נבחר
      return 0;
    });

  // שליפת קטגוריות ל-Dropdown של קטגוריה
  const categories = ["All", ...new Set(products.map(product => product.category))];

  return (
    <div className="main-container">
      <div className="filters-wrapper">
        <div className="filters-container">
          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="category-select">Filter by Category</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-input"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="filter-group">
              <label htmlFor="sort-select">Sort by</label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="select-input"
              >
                <option value="none">None</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
        </div>
      </div>
  
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
