import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { getProducts } from "../utils/UserRoutes";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // --- Utility Functions ---
  const fetchProducts = async () => {
    try {
      const cachedProducts = cookies.get("products");
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      } else {
        const response = await axios.get(getProducts);
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        cookies.set("products", JSON.stringify(fetchedProducts), { expires: 7 });
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const saveCartAndWishlist = async () => {
    if (!user?.id) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const wishlistToSave = JSON.parse(localStorage.getItem("wishlist")) || [];

    console.log("Saving cart:", cart);
    console.log("Saving wishlist:", wishlistToSave);

    try {
      // שמירת העגלה
      for (const productId of cart) {
        const response = await axios.patch("http://localhost:3001/user/add-to-cart", {
          userId: user.id,
          productId,
        });
        console.log("Cart save response:", response.data);
      }

      // שמירת רשימת המשאלות
      for (const productId of wishlistToSave) {
        const response = await axios.patch("http://localhost:3001/user/add-to-wish-list", {
          userId: user.id,
          productId,
        });
        console.log("Wishlist save response:", response.data);
      }

      console.log("Cart and Wishlist saved successfully.");
    } catch (error) {
      console.error("Error saving cart or wishlist:", error.message);
    }
  };

  const restoreUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin || false);
      setWishlist(parsedUser.wishList || []);
    }
  };

  // --- Core Functions ---
  const updateUser = (newUser) => {
    setUser(newUser);
    setIsAdmin(newUser.isAdmin || false);
    setWishlist(newUser.wishList || []);
    localStorage.setItem("user", JSON.stringify(newUser));
    cookies.set("userId", newUser.id, { expires: 7 });
  };

  const logout = async () => {
    if (!user?.id) {
      console.error("User is not logged in.");
      return;
    }

    await saveCartAndWishlist();

    // איפוס נתוני המשתמש
    setUser(null);
    setIsAdmin(false);
    setWishlist([]);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    window.location.reload();
  };

  const addToCart = async (productId) => {
    if (!user?.id) {
      console.error("User is not logged in.");
      return;
    }

    try {
      // קריאה לשרת להוספת המוצר לעגלה
      const response = await axios.patch("http://localhost:3001/user/add-to-cart", {
        userId: user.id,
        productId,
      });

      // עדכון עגלת הקניות המקומית (localStorage)
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!updatedCart.includes(productId)) {
        updatedCart.push(productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      console.log("Product added to cart:", response.data);
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const addToWishList = async (productId) => {
    if (!user?.id) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const response = await axios.patch("http://localhost:3001/user/add-to-wish-list", {
        userId: user.id,
        productId,
      });
      const updatedWishList = response.data.wishList;

      // עדכון המשתמש וה-localStorage
      updateUser({ ...user, wishList: updatedWishList });
      localStorage.setItem("wishlist", JSON.stringify(updatedWishList));

      console.log("Product added to wishlist:", response.data.message);
    } catch (error) {
      console.error("Error adding product to wishlist:", error.message);
    }
  };

  // --- Effects ---
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    restoreUserFromLocalStorage();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        logout,
        query,
        updateQuery: setQuery,
        products,
        isAdmin,
        wishlist,
        addToCart,
        addToWishList,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
