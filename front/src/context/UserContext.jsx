import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { getProducts } from '../utils/UserRoutes';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!cookies.get("products")) {
          const response = await axios.get(getProducts);
          const fetchedProducts = response.data.products || [];
          setProducts(fetchedProducts);
          cookies.set("products", JSON.stringify(fetchedProducts), { expires: 7 });
        } else {
          const cachedProducts = JSON.parse(cookies.get("products"));
          setProducts(cachedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false);
      setWishlist(parsedUser.wishList || []);
    }
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
    setIsAdmin(newUser.isAdmin || false);
    setWishlist(newUser.wishList || []);
    localStorage.setItem('user', JSON.stringify(newUser));
    cookies.set("userId", newUser.id, { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setWishlist([]);
    localStorage.removeItem('user');
  };

  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  const addToWishList = async (productId) => {
    if (!user || !user.id) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/wishlist", {
        userId: user.id,
        productId
      });
      const updatedWishList = response.data.wishList;
      setUser((prevUser) => ({ ...prevUser, wishList: updatedWishList }));
      setWishlist(updatedWishList);
      localStorage.setItem('user', JSON.stringify({ ...user, wishList: updatedWishList }));
      console.log(response.data.message);
    } catch (error) {
      console.error("Error adding product to wishlist:", error.response?.data?.message || error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, query, updateQuery, products, isAdmin, wishlist, addToWishList }}>
      {children}
    </UserContext.Provider>
  );
};
