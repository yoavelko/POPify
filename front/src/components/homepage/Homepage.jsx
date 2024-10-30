import ProductBox from "../productBox/ProductBox";
import './Homepage.css';
import { useUser } from '../../context/UserContext';

function Homepage() {
  const { query, products } = useUser();

  const filteredProducts = products.filter(item =>
    item.name && item.name.toLowerCase().includes(query.toLowerCase())
  );

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
