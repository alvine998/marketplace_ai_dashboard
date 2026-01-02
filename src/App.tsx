import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import ForgotPasswordPage from './pages/forgot-password';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/dashboard';
import ProductPage from './pages/products';
import CustomerPage from './pages/customers';
import AIChatPage from './pages/ai-chat';
import AIChatOrdersPage from './pages/ai-chat-orders';
import PromoPage from './pages/promos';
import NotificationsPage from './pages/notifications';
import NotificationDetailPage from './pages/notifications/detail';
import PushNotificationPage from './pages/push-notifications';
import SellerPage from './pages/sellers';
import SellerDetailPage from './pages/sellers/detail';
import AdminManagementPage from './pages/settings/admin-management';
import CategoriesPage from './pages/settings/categories';
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
          <Route path="ai-chat" element={<AIChatPage />} />
          <Route path="ai-orders" element={<AIChatOrdersPage />} />
          <Route path="promos" element={<PromoPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notifications/:id" element={<NotificationDetailPage />} />
          <Route path="push-notifications" element={<PushNotificationPage />} />
          <Route path="sellers" element={<SellerPage />} />
          <Route path="sellers/:id" element={<SellerDetailPage />} />
          <Route path="settings/admin" element={<AdminManagementPage />} />
          <Route path="settings/categories" element={<CategoriesPage />} />
          {/* Add more main routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
