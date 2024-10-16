import { createContext, useContext, useState, useEffect } from 'react';

// יצירת הקונטקסט
const UserContext = createContext();

// יצירת hook מותאם אישית לשימוש בקונטקסט
export const useUser = () => useContext(UserContext);

// ספק הקונטקסט לכל האפליקציה
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
