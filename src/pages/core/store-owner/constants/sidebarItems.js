import { 
  BarChart2, ShoppingCart, Package, Settings, 
  Layers, CreditCard, Megaphone, Users2
} from 'lucide-react';

export const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: BarChart2, path: '/dashboard' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { id: 'catalog', label: 'Catalog', icon: Layers, path: '/catalog' },
  { id: 'prices', label: 'Prices', icon: Package, path: '/prices' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, path: '/campaigns' },
  { id: 'staff', label: 'Staff', icon: Users2, path: '/staff' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];
