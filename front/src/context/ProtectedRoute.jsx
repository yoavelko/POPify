import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // נתיב יחסי נכון

function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);

  // בדוק אם המשתמש קיים ואם הוא מנהל
  if (!user || !user.isAdmin) {
    return <Navigate to="/" />; // ניתוב מחדש לדף הבית אם המשתמש לא מנהל
  }

  return children; // החזרת הדף המוגן אם המשתמש הוא מנהל
}

export default ProtectedRoute;
