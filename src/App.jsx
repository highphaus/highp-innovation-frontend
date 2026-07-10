import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🏢 Core Platform Hub Elements
import PlatformHome from "./pages/core/PlatformHome";
import NotFound from "./pages/core/NotFound";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import PlatformLogin from "./pages/core/PlatformLogin";
import StoreRegister from "./pages/core/StoreRegister";
import StoreOwnerProfile from "./pages/core/StoreOwnerProfile";

// 🛒 Public Customer Facing Catalog Panel
import StorefrontHome from "./pages/storefront/StorefrontHome";
import ProductView from "./pages/storefront/ProductView";
import CustomerCart from "./pages/storefront/CustomerCart";
import CustomerProfile from "./pages/storefront/CustomerProfile";

// 🔐 Multi-Role Merchant Dashboards Modules
import UnifiedLogin from "./pages/shared/UnifiedLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InventoryManagement from "./pages/admin/InventoryManagement";
import PricesManagement from "./pages/admin/PricesManagement";
import CampaignsManagement from "./pages/admin/CampaignsManagement";
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
        <Route path="/admin" element={<SuperAdminDashboard />} />
        <Route path="/login" element={<PlatformLogin />} />
        <Route path="/register" element={<StoreRegister />} />
        <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<StoreOwnerProfile />} />
        <Route path="/orders" element={<StoreOwnerProfile />} />
        <Route path="/catalog" element={<StoreOwnerProfile />} />
        <Route path="/prices" element={<StoreOwnerProfile />} />
        <Route path="/campaigns" element={<StoreOwnerProfile />} />
        <Route path="/balance" element={<StoreOwnerProfile />} />
        <Route path="/analytics" element={<StoreOwnerProfile />} />
        <Route path="/staff" element={<StoreOwnerProfile />} />
        <Route path="/settings" element={<StoreOwnerProfile />} />
        <Route path="/products/new" element={<StoreOwnerProfile />} />

        {/* 2. Isolated Tenant Navigation Pipeline Mapping */}
        <Route path="/:storeSlug">
          {/* Customer Facing Retail App (e.g. localhost:5174/tastenpark) */}
          <Route index element={<StorefrontHome />} />

          {/* Product Detail View */}
          <Route path="product/:productId" element={<ProductView />} />

          {/* Customer Cart & Checkout */}
          <Route path="cart" element={<CustomerCart />} />

          {/* Customer Profile Management */}
          <Route path="profile" element={<CustomerProfile />} />

          {/* Unified login gateway for staff */}
          <Route path="login" element={<UnifiedLogin />} />

          {/* Manager Workspace (e.g. localhost:5174/tastenpark/admin) */}
          <Route path="admin" element={<AdminDashboard />} />

          {/* Admin sub-pages */}
          <Route path="admin/inventory" element={<InventoryManagement />} />
          <Route path="admin/prices" element={<PricesManagement />} />
          <Route path="admin/campaigns" element={<CampaignsManagement />} />
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