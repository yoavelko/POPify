import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { getProducts } from '../utils/UserRoutes';

// יצירת הקונטקסט
const UserContext = createContext();

// יצירת hook מותאם אישית לשימוש בקונטקסט
export const useUser = () => useContext(UserContext);

// ספק הקונטקסט לכל האפליקציה
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]); // אחסון המוצרים

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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // פונקציה לעדכון המשתמש ושמירתו ב-localStorage
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // פונקציה להתנתקות המשתמש
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, query, updateQuery,products }}>
      {children}
    </UserContext.Provider>
  );
};
