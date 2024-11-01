import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { getProducts } from '../utils/UserRoutes';

export const UserContext = createContext(); // ייצוא ההקשר של המשתמש

export const useUser = () => useContext(UserContext); // ייצוא ה-Hook

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // מצב לבדיקת אם המשתמש הוא מנהל

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

  // טעינת המשתמש מה-localStorage כשהאפליקציה עולה
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false); // בדיקה אם המשתמש הוא מנהל
    }
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
    setIsAdmin(newUser.isAdmin || false); // עדכון מצב המנהל
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false); // איפוס מצב המנהל
    localStorage.removeItem('user');
  };

  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, query, updateQuery, products, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
