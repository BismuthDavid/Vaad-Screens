// frontend/src/store/authStore.ts
import { create } from 'zustand';

interface User {
  email: string;
  full_name: string;
  role: string;
  building_id: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // טעינה ראשונית מהזיכרון המקומי (למקרה שהמשתמש עשה רענון לדף)
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  
  // פונקציה לשמירת פרטי ההתחברות
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  
  // פונקציה להתנתקות
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));