// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Display from './pages/Display';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* נתיב פתוח להתחברות */}
        <Route path="/login" element={<Login />} />
        
        {/* ניתוב אוטומטי מדף הבית לדאשבורד */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* נתיבים מוגנים (רק למי שמחובר) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/display" element={<Display />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;