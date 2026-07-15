import React from "react";
import { useAuth } from "@/lib/AuthContext";
import { useOrders } from "@/lib/OrderContext";
import { Home, UtensilsCrossed, ShoppingBag, UserCircle2, Briefcase, Truck, BarChart3 } from "lucide-react";

export function BottomNav() {
  const { role, activeTab, setActiveTab } = useAuth();
  const { cart } = useOrders();

  if (role === "admin" || role === "staff") return null;

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const customerLinks = [
    { name: "Home", icon: Home },
    { name: "Menu", icon: UtensilsCrossed },
    { name: "Cart", icon: ShoppingBag, badge: cartCount },
    { name: "Profile", icon: UserCircle2 },
  ];

  const driverLinks = [
    { name: "Jobs", icon: Briefcase },
    { name: "Active", icon: Truck },
    { name: "Earnings", icon: BarChart3 },
  ];

  const links = role === "driver" ? driverLinks : customerLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/90 pb-safe backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-[64px] max-w-sm items-stretch px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.name;
          return (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95"
            >
              {isActive && <span className="absolute top-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-b-full bg-[var(--brand)]" />}
              <div className="relative">
                <Icon className={`h-[22px] w-[22px] transition-transform duration-200 ${isActive ? "scale-110" : ""}`} style={{ color: isActive ? "var(--brand)" : "var(--text-4)" }} />
                {link.badge && link.badge > 0 ? (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand)] text-[9px] font-black text-white">
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] leading-none transition-all ${isActive ? "font-semibold text-[var(--brand)]" : "font-medium text-[var(--text-4)]"}`}>
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
