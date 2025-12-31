import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import ForgotPasswordPage from './pages/forgot-password';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard';
import ProductPage from './pages/products';
import CustomerPage from './pages/customers';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Main Application Layout */}
        <Route path="/main" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="customers" element={<CustomerPage />} />
          {/* Add more main routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
