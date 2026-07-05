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
      { name: "Home",    icon: Home },
      { name: "Menu",    icon: UtensilsCrossed },
      { name: "Cart",    icon: ShoppingBag, badge: cart.length > 0 ? cart.reduce((s, i) => s + i.quantity, 0) : 0 },
      { name: "Profile", icon: UserCircle2 },
    ],
    driver: [
      { name: "Jobs",     icon: Briefcase },
      { name: "Active",   icon: Truck },
      { name: "Earnings", icon: BarChart3 },
    ],
    staff: [
      { name: "Kitchen",   icon: ChefHat },
      { name: "Inventory", icon: Package },
    ],
    admin: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "Orders",    icon: ListOrdered },
      { name: "Products",  icon: PlusSquare },
    ],
  };

  const links = navMap[role] || [];
  const roleLabels = { customer: "Customer", driver: "Driver", staff: "Staff", admin: "Admin" };
  const roleAvatars = { customer: "AS", driver: "DR", staff: "KT", admin: "AD" };

  return (
    <aside className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 w-[220px]" style={{ background: "var(--sidebar-bg)" }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "#1a1a1a" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--brand)" }}>
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none tracking-tight">Taste N Park</p>
            <p className="text-[11px] mt-0.5" style={{ color: "#555" }}>Premium Bakery</p>
          </div>
        </div>
      </div>

      {/* Role label */}
      <div className="px-6 pt-5 pb-2">
        <p className="label-upper" style={{ color: "#444" }}>{roleLabels[role]} Portal</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.name;
          return (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 w-full text-left relative group"
              style={{
                background: isActive ? "rgba(232,64,12,0.12)" : "transparent",
                color: isActive ? "#E8400C" : "var(--sidebar-text)",
              }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: "var(--brand)" }} />
              )}
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="text-[13px] font-semibold tracking-[-0.01em]">{link.name}</span>
              {link.badge && link.badge > 0 ? (
                <span className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: "var(--brand)", color: "#fff" }}>
                  {link.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: "#141414" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white" style={{ background: "var(--brand)" }}>
            {roleAvatars[role]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold leading-none truncate">
              {role === "customer" ? "Alice Smith" : role === "driver" ? "Mark Rider" : role === "staff" ? "Kitchen Team" : "Super Admin"}
            </p>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: "#555" }}>{roleLabels[role]}</p>
          </div>
          <LogOut className="w-3.5 h-3.5 shrink-0 opacity-30 hover:opacity-70 transition-opacity cursor-pointer" style={{ color: "#fff" }} />
        </div>
      </div>
    </aside>
  );
}
