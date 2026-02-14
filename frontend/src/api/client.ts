// frontend/src/api/client.ts
import axios from 'axios';

// יצירת מופע של Axios עם כתובת בסיס וזמן תפוגה
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 שניות Time out
});

// Interceptor: פונקציה שרצה אוטומטית לפני כל בקשה לשרת
// התפקיד שלה הוא לשלוף את הטוקן מהזיכרון ולצרף אותו לכותרת האבטחה
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});