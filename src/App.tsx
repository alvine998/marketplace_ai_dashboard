import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './components/guards/RouteGuards';
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
import RolePermissionsPage from './pages/settings/roles-permissions';
import ActivityLogsPage from './pages/settings/activity-logs';
import LoginAttemptsPage from './pages/settings/login-attempts';
import VouchersPage from './pages/vouchers';
import FeedPage from './pages/feed';
import SubCategoriesPage from './pages/subcategories';
import AboutUsPage from './pages/about-us';
import FAQPage from './pages/faq';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest Routes - redirect to dashboard if already logged in */}
        <Route path="/" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

        {/* Protected Routes - require authentication */}
        <Route path="/main" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
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
          <Route path="settings/roles" element={<RolePermissionsPage />} />
          <Route path="settings/activity-logs" element={<ActivityLogsPage />} />
          <Route path="settings/login-attempts" element={<LoginAttemptsPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="subcategories" element={<SubCategoriesPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="faq" element={<FAQPage />} />
          {/* Add more main routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

