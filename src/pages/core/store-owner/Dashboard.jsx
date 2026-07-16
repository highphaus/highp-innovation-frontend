import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import OverviewTab from './tabs/OverviewTab';
import OrdersTab from './tabs/OrdersTab';
import CatalogTab from './tabs/CatalogTab';
import PricesTab from './tabs/PricesTab';
import AddProductTab from './tabs/AddProductTab';
import CampaignsTab from './tabs/CampaignsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import BalanceTab from './tabs/BalanceTab';
import StaffTab from './tabs/StaffTab';
import SettingsTab from './tabs/SettingsTab';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
        <p className="text-neutral-500">Welcome to your dashboard.</p>
      </div>
    </DashboardLayout>
  );
}
