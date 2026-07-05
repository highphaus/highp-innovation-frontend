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
    { name: "Home",    icon: Home },
    { name: "Menu",    icon: UtensilsCrossed },
    { name: "Cart",    icon: ShoppingBag, badge: cartCount },
    { name: "Profile", icon: UserCircle2 },
  ];

  const driverLinks = [
    { name: "Jobs",     icon: Briefcase },
    { name: "Active",   icon: Truck },
    { name: "Earnings", icon: BarChart3 },
  ];

  const links = role === "driver" ? driverLinks : customerLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe"
      style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid var(--border-light)" }}
    >
      <div className="flex items-stretch h-[62px] max-w-sm mx-auto px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.name;
          return (
            <button
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className="flex flex-col items-center justify-center flex-1 gap-1 relative transition-all duration-200 active:scale-90"
              style={{ color: isActive ? "var(--brand)" : "var(--text-4)" }}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full" style={{ background: "var(--brand)" }} />
              )}
              <div className="relative">
                <Icon className={`w-[22px] h-[22px] transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                {link.badge && link.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ background: "var(--brand)" }}>
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] leading-none transition-all ${isActive ? "font-700 opacity-100" : "font-500 opacity-70"}`} style={{ fontWeight: isActive ? 700 : 500 }}>
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
