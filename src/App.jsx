import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🏢 Core Platform Hub Elements
import PlatformHome from "./pages/core/PlatformHome";
import NotFound from "./pages/core/NotFound";

// 🛒 Public Customer Facing Catalog Panel
import StorefrontHome from "./pages/storefront/StorefrontHome";
import ProductView from "./pages/storefront/ProductView";
import CustomerCart from "./pages/storefront/CustomerCart";

// 🔐 Multi-Role Merchant Dashboards Modules
import UnifiedLogin from "./pages/shared/UnifiedLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InventoryManagement from "./pages/admin/InventoryManagement";
import AnalyticsMetrics from "./pages/admin/AnalyticsMetrics";
import StaffManagement from "./pages/admin/StaffManagement";
import LiveKDSFeed from "./pages/kitchen/LiveKDSFeed";
import DispatchLogistics from "./pages/delivery/DispatchLogistics";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. SaaS Hub - Onboard New Merchants Globally */}
        <Route path="/" element={<PlatformHome />} />

        {/* 2. Isolated Tenant Navigation Pipeline Mapping */}
        <Route path="/:storeSlug">
          {/* Customer Facing Retail App (e.g. localhost:5174/tastenpark) */}
          <Route index element={<StorefrontHome />} />

          {/* Product Detail View */}
          <Route path="product/:productId" element={<ProductView />} />

          {/* Customer Cart & Checkout */}
          <Route path="cart" element={<CustomerCart />} />

          {/* Unified login gateway for staff */}
          <Route path="login" element={<UnifiedLogin />} />

          {/* Manager Workspace (e.g. localhost:5174/tastenpark/admin) */}
          <Route path="admin" element={<AdminDashboard />} />

          {/* Admin sub-pages */}
          <Route path="admin/inventory" element={<InventoryManagement />} />
          <Route path="admin/analytics" element={<AnalyticsMetrics />} />
          <Route path="admin/staff" element={<StaffManagement />} />

          {/* Kitchen Display Screen KDS (e.g. localhost:5174/tastenpark/kitchen) */}
          <Route path="kitchen" element={<LiveKDSFeed />} />

          {/* Fleet Rider Distribution Desk (e.g. localhost:5174/tastenpark/delivery) */}
          <Route path="delivery" element={<DispatchLogistics />} />
        </Route>

        {/* 3. Catch-All Pipeline Protection Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}