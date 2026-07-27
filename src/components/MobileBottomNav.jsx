import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, ClipboardList, Heart, User } from "lucide-react";

/**
 * MobileBottomNav — 5 independent sticky bottom navigation tabs for storefront customer pages.
 * Home | Wishlist | Cart | My Orders | Profile
 */
export default function MobileBottomNav({ storeSlug, cartCount = 0 }) {
  const location = useLocation();
  const path = location.pathname;
  const search = location.search;
  const currentTab = new URLSearchParams(search).get("tab");

  const isHomeActive = path === `/${storeSlug}` || path === `/${storeSlug}/`;
  const isCartActive = path.startsWith(`/${storeSlug}/cart`);
  const isWishlistActive = path.startsWith(`/${storeSlug}/profile`) && currentTab === "wishlist";
  const isOrdersActive = path.startsWith(`/${storeSlug}/profile`) && (currentTab === "orders" || currentTab === "order");
  const isProfileActive = path.startsWith(`/${storeSlug}/profile`) && (currentTab === "info" || currentTab === "account" || currentTab === "addresses" || !currentTab);

  const navItems = [
    {
      label: "Home",
      icon: Home,
      to: `/${storeSlug}`,
      active: isHomeActive,
    },
    {
      label: "Wishlist",
      icon: Heart,
      to: `/${storeSlug}/profile?tab=wishlist`,
      active: isWishlistActive,
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      to: `/${storeSlug}/cart`,
      active: isCartActive,
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      label: "My Orders",
      icon: ClipboardList,
      to: `/${storeSlug}/profile?tab=orders`,
      active: isOrdersActive,
    },
    {
      label: "Profile",
      icon: User,
      to: `/${storeSlug}/profile?tab=account`,
      active: isProfileActive,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch h-16">
        {navItems.map(({ label, icon: Icon, to, active, badge }) => (
          <Link
            key={label}
            to={to}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors cursor-pointer
              ${active ? "text-[#D03D56]" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#D03D56] rounded-b-full" />
            )}

            <span className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              {badge && (
                <span className="absolute -top-1.5 -right-2 bg-[#D03D56] text-white font-black text-[8px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center shadow-sm leading-none">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </span>

            <span
              className={`text-[9px] font-bold tracking-wide leading-none transition-all
                ${active ? "text-[#D03D56]" : "text-neutral-400"}`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
