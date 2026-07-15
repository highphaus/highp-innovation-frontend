import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useOrders } from "@/lib/OrderContext";
import {
  Home, UtensilsCrossed, ShoppingBag, UserCircle2,
  Briefcase, Truck, BarChart3,
  ChefHat, Package, LayoutDashboard, ListOrdered, PlusSquare,
  LogOut
} from "lucide-react";

export function Sidebar() {
  const { role, activeTab, setActiveTab } = useAuth();
  const { cart } = useOrders();

  const navMap = {
    customer: [
      { name: "Home", icon: Home },
      { name: "Menu", icon: UtensilsCrossed },
      { name: "Cart", icon: ShoppingBag, badge: cart.length > 0 ? cart.reduce((s, i) => s + i.quantity, 0) : 0 },
      { name: "Profile", icon: UserCircle2 },
    ],
    driver: [
      { name: "Jobs", icon: Briefcase },
      { name: "Active", icon: Truck },
      { name: "Earnings", icon: BarChart3 },
    ],
    staff: [
      { name: "Kitchen", icon: ChefHat },
      { name: "Inventory", icon: Package },
    ],
    admin: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Orders", icon: ListOrdered },
      { name: "Products", icon: PlusSquare },
    ],
  };

  const links = navMap[role] || [];
  const roleLabels = { customer: "Customer", driver: "Driver", staff: "Staff", admin: "Admin" };
  const roleAvatars = { customer: "AS", driver: "DR", staff: "KT", admin: "AD" };

  return (
    <aside className="hidden h-screen w-[240px] shrink-0 flex-col sticky top-0 overflow-y-auto overflow-x-hidden border-r border-[var(--border)] bg-[var(--sidebar-bg)] md:flex">
      <div className="border-b border-[var(--border)] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand)] shadow-sm">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold leading-none text-[var(--text-primary)]">Taste N Park</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-3)]">Premium Bakery</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-2 pt-5">
        <p className="label-upper">{roleLabels[role]} Portal</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.name;
          return (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className={`relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all ${isActive ? "bg-[var(--brand-light)] text-[var(--brand)]" : "text-[var(--sidebar-text)] hover:bg-white hover:text-[var(--text-primary)]"}`}
            >
              {isActive && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--brand)]" />}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="text-[13px] font-semibold tracking-[-0.01em]">{link.name}</span>
              {link.badge && link.badge > 0 ? (
                <span className="ml-auto rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[10px] font-black text-white">
                  {link.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-[#161514] px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-black text-white">
            {roleAvatars[role]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-none text-white">
              {role === "customer" ? "Alice Smith" : role === "driver" ? "Mark Rider" : role === "staff" ? "Kitchen Team" : "Super Admin"}
            </p>
            <p className="mt-1 truncate text-[11px] text-[#a7a29d]">{roleLabels[role]}</p>
          </div>
          <LogOut className="h-3.5 w-3.5 shrink-0 cursor-pointer text-white/60 transition-opacity hover:text-white" />
        </div>
      </div>
    </aside>
  );
}
