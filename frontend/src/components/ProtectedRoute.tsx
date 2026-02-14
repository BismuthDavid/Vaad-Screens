// frontend/src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);

  // אם אין טוקן, ננווט חזרה לעמוד ההתחברות
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Outlet הוא בעצם "פלייסהולדר" שאומר ל-React Router:
  // "אם הכל בסדר, תרנדר כאן את העמוד שהמשתמש ביקש"
  return <Outlet />;
}