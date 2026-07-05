import React, { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import {
  Search, ShoppingBag, Clock, Minus, Plus, Trash2,
  MapPin, CheckCircle2, ChevronRight, ArrowRight, Sparkles, Bike
} from "lucide-react";
import { useOrders } from "@/lib/OrderContext";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MAP = {
  pending:    { label: "Order Received",   pct: 20, color: "#D97706" },
  preparing:  { label: "Baking Now",       pct: 55, color: "var(--brand)" },
  ready:      { label: "Ready for Pickup", pct: 78, color: "#2563EB" },
  delivering: { label: "Out for Delivery", pct: 92, color: "#7C3AED" },
  delivered:  { label: "Delivered",        pct: 100, color: "#16A34A" },
};

export default function CustomerDashboard() {
  const { orders, products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, addOrder } = useOrders();
  const { activeTab, setActiveTab } = useAuth();

  const customerName = "Alice Smith";
  const myOrders = orders.filter(o => o.customerName === customerName);
  const activeOrders = myOrders.filter(o => o.status !== "delivered");
  const pastOrders   = myOrders.filter(o => o.status === "delivered");

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery]         = useState("");
  const [isCakeBuilderOpen, setIsCakeBuilderOpen] = useState(false);
  const [cakeWeight, setCakeWeight]           = useState("2");
  const [cakeFlavor, setCakeFlavor]           = useState("Chocolate Truffle");
  const [cakeInstructions, setCakeInstructions] = useState("");
  const [orderType, setOrderType]             = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("123 Main St, Springfield");
  const [tableNumber, setTableNumber]         = useState("Table 4");
  const [isPlacingOrder, setIsPlacingOrder]   = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId]     = useState("");

  const categories = ["All", "Cakes", "Pastries", "Breads", "Meals", "Drinks"];

  const filteredProducts = products.filter(p => {
    if (!p.available) return false;
    const matchCat  = activeCategory === "All" || p.category === activeCategory;
    const matchSrch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSrch;
  });

  const cartCount    = cart.reduce((s, i) => s + i.quantity, 0);
  const getSubtotal  = () => cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const getTax       = () => getSubtotal() * 0.0825;
  const getDelivery  = () => (orderType === "delivery" ? 3.99 : 0);
  const getTotal     = () => getSubtotal() + getTax() + getDelivery();

  const handleAddCustomCake = () => {
    const wt = parseFloat(cakeWeight) || 2;
    const price = 25 + Math.max(0, (wt - 2) * 10);
    addToCart(
      { id: "PROD-CUSTOM", name: `Custom ${cakeFlavor} Cake (${cakeWeight} lbs)`, description: "Your personalised creation", price, category: "Cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80", isCustomizable: true, available: true },
      1, { weight: cakeWeight, flavor: cakeFlavor, instructions: cakeInstructions }
    );
    setIsCakeBuilderOpen(false);
    setActiveTab("Cart");
  };

  const handlePlaceOrder = () => {
    if (!cart.length) return;
    setIsPlacingOrder(true);
    setTimeout(() => {
      const subtotal = getSubtotal();
      addOrder({
        customerName,
        items: cart.map(i => ({ id: i.product.id, name: i.product.name, quantity: i.quantity, price: i.product.price })),
        total: parseFloat(getTotal().toFixed(2)),
        type: orderType,
        address: orderType === "delivery" ? deliveryAddress : undefined,
        tableNumber: orderType === "dine-in" ? tableNumber : undefined,
      });
      const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setPlacedOrderId(id);
      setIsPlacingOrder(false);
      setOrderPlacedSuccess(true);
      clearCart();
    }, 1400);
  };

  /* ─── shared header row ─────────────────────────────── */
  const TopBar = ({ title }) => (
    <div className="flex items-center justify-between px-5 pt-6 pb-4">
      <div>
        <p className="label-upper mb-0.5">Taste N Park</p>
        <h1 className="heading-lg" style={{ color: "var(--text-primary)" }}>{title}</h1>
      </div>
      <button
        onClick={() => setActiveTab("Cart")}
        className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
      >
        <ShoppingBag className="w-[18px] h-[18px]" style={{ color: "var(--text-primary)" }} />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ background: "var(--brand)" }}>
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto pb-24">

      {/* ══════ HOME ══════ */}
      {activeTab === "Home" && (
        <div>
          <TopBar title={`Hello, ${customerName.split(" ")[0]} 👋`} />
          <div className="px-5 flex flex-col gap-6 pb-6">

            {/* Hero promo */}
            <div className="rounded-2xl overflow-hidden relative flex items-center" style={{ background: "#0A0A0A", minHeight: 160 }}>
              <div className="p-6 z-10 flex-1">
                <span className="badge badge-brand mb-3 inline-block">Weekend Special</span>
                <h2 className="heading-md text-white mb-1">Design Your<br/>Dream Cake</h2>
                <p className="text-[12px] mb-4" style={{ color: "#888" }}>Custom size, flavor & icing.</p>
                <button
                  onClick={() => setIsCakeBuilderOpen(true)}
                  className="btn-primary text-[12px] px-4 py-2.5 rounded-xl"
                >
                  Start Customizing
                </button>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-[42%] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" alt="Cake" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0a0a 20%, transparent)" }} />
              </div>
            </div>

            {/* Active orders */}
            {activeOrders.length > 0 && (
              <div>
                <h3 className="heading-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: "var(--brand)" }} /> Live Orders
                </h3>
                <div className="flex flex-col gap-3">
                  {activeOrders.map(order => {
                    const s = STATUS_MAP[order.status] || STATUS_MAP.pending;
                    return (
                      <div key={order.id} className="card p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="label-upper mb-0.5">{order.id}</p>
                            <p className="heading-sm" style={{ color: "var(--text-primary)" }}>{s.label}</p>
                          </div>
                          <span className="badge" style={{ background: `${s.color}18`, color: s.color }}>{order.type}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full mb-1.5" style={{ background: "var(--surface-3)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: s.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.pct}%` }}
                            transition={{ duration: 1.1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 10, color: "var(--text-4)", fontWeight: 600 }}>
                          {["Received", "Baking", "Ready", "Delivery"].map(l => <span key={l}>{l}</span>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Featured products */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="heading-sm">Staff Picks</h3>
                <button onClick={() => setActiveTab("Menu")} className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--brand)" }}>
                  Full Menu <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {products.filter(p => p.available).slice(0, 4).map(product => (
                  <div key={product.id} className="card card-hover overflow-hidden flex flex-col">
                    <div className="relative h-32 overflow-hidden" style={{ background: "var(--surface-3)" }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.isCustomizable && (
                        <span className="absolute top-2 left-2 badge badge-dark text-[9px]">Custom</span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-[13px] font-700 leading-snug mb-0.5 truncate" style={{ fontWeight: 700, color: "var(--text-primary)" }}>{product.name}</p>
                      <p className="text-[11px] mb-3 line-clamp-1" style={{ color: "var(--text-3)" }}>{product.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[14px] font-800" style={{ fontWeight: 800, color: "var(--text-primary)" }}>${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => product.isCustomizable ? setIsCakeBuilderOpen(true) : addToCart(product, 1)}
                          className="btn-primary w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-[18px] pb-0.5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MENU ══════ */}
      {activeTab === "Menu" && (
        <div>
          <TopBar title="Our Menu" />
          {/* sticky search + cats */}
          <div className="px-5 pb-3 sticky top-0 z-30" style={{ background: "var(--surface-2)" }}>
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-4)" }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search cakes, pastries, coffee…"
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all shrink-0"
                  style={activeCategory === cat
                    ? { background: "var(--text-primary)", color: "#fff", fontWeight: 700 }
                    : { background: "var(--surface)", color: "var(--text-3)", border: "1px solid var(--border)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 pb-6">
            {filteredProducts.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="heading-sm mb-1" style={{ color: "var(--text-3)" }}>No Items Found</p>
                <p className="text-[12px]" style={{ color: "var(--text-4)" }}>Try a different search or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map(product => (
                  <motion.div layout key={product.id} className="card card-hover overflow-hidden flex flex-col">
                    <div className="relative h-36 overflow-hidden" style={{ background: "var(--surface-3)" }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.isCustomizable && (
                        <span className="absolute top-2 left-2 badge badge-dark text-[9px]">Customizable</span>
                      )}
                      {!product.available && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="badge badge-neutral">Unavailable</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex flex-col flex-1">
                      <span className="badge badge-neutral mb-2 self-start">{product.category}</span>
                      <p className="text-[13px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>{product.name}</p>
                      <p className="text-[11px] line-clamp-2 mb-3" style={{ color: "var(--text-3)" }}>{product.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>${product.price.toFixed(2)}</span>
                        <button
                          onClick={() => product.isCustomizable ? setIsCakeBuilderOpen(true) : addToCart(product, 1)}
                          className="btn-primary px-3.5 py-2 rounded-xl text-[12px]"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ CART ══════ */}
      {activeTab === "Cart" && (
        <div>
          <div className="flex items-center justify-between px-5 pt-6 pb-4">
            <h1 className="heading-lg">Cart</h1>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-[12px] font-semibold" style={{ color: "var(--text-3)" }}>Clear all</button>
            )}
          </div>

          <div className="px-5 pb-6">
            {orderPlacedSuccess ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8 text-center flex flex-col items-center gap-4 mt-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#DCFCE7" }}>
                  <CheckCircle2 className="w-7 h-7" style={{ color: "#16A34A" }} />
                </div>
                <div>
                  <h2 className="heading-md mb-1">Order Placed!</h2>
                  <p className="text-[13px]" style={{ color: "var(--text-3)" }}>
                    <strong>{placedOrderId}</strong> is being transmitted to the kitchen.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <button onClick={() => { setOrderPlacedSuccess(false); setActiveTab("Home"); }} className="btn-primary w-full py-3 rounded-xl text-[13px]">
                    Track Live Status
                  </button>
                  <button onClick={() => { setOrderPlacedSuccess(false); setActiveTab("Menu"); }} className="btn-secondary w-full py-3 rounded-xl text-[13px]">
                    Order More
                  </button>
                </div>
              </motion.div>
            ) : cart.length === 0 ? (
              <div className="card p-10 text-center flex flex-col items-center gap-4 mt-4">
                <ShoppingBag className="w-10 h-10" style={{ color: "var(--text-4)" }} />
                <div>
                  <p className="heading-sm mb-1">Your cart is empty</p>
                  <p className="text-[12px]" style={{ color: "var(--text-3)" }}>Add items from our menu to get started.</p>
                </div>
                <button onClick={() => setActiveTab("Menu")} className="btn-primary px-6 py-2.5 rounded-xl text-[13px]">Browse Menu</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
                {/* Cart items */}
                <div className="lg:col-span-3 flex flex-col gap-2.5">
                  {cart.map((item, idx) => (
                    <div key={idx} className="card p-4 flex items-center gap-4">
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover shrink-0" style={{ background: "var(--surface-3)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold truncate" style={{ color: "var(--text-primary)" }}>{item.product.name}</p>
                        <p className="text-[12px] font-semibold mt-0.5" style={{ color: "var(--brand)" }}>${item.product.price.toFixed(2)}</p>
                        {item.customDetails && (
                          <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-4)" }}>
                            {item.customDetails.flavor} · {item.customDetails.weight} lbs
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 rounded-xl px-2 py-1.5 shrink-0" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center rounded-md active:scale-90 transition-transform">
                          <Minus className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                        </button>
                        <span className="text-[13px] font-bold w-4 text-center" style={{ color: "var(--text-primary)" }}>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center rounded-md active:scale-90 transition-transform">
                          <Plus className="w-3 h-3" style={{ color: "var(--text-3)" }} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-all" style={{ color: "#EF4444" }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Order summary */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="card p-5 flex flex-col gap-4">
                    <h3 className="heading-sm">Order Details</h3>

                    {/* Type toggle */}
                    <div className="flex rounded-xl overflow-hidden p-1 gap-1" style={{ background: "var(--surface-2)" }}>
                      {["delivery", "takeaway", "dine-in"].map(t => (
                        <button
                          key={t}
                          onClick={() => setOrderType(t)}
                          className="flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all"
                          style={orderType === t
                            ? { background: "var(--text-primary)", color: "#fff" }
                            : { color: "var(--text-3)" }
                          }
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {orderType === "delivery" && (
                      <div>
                        <p className="label-upper mb-1.5">Delivery Address</p>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--brand)" }} />
                          <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="input pl-9" />
                        </div>
                      </div>
                    )}
                    {orderType === "dine-in" && (
                      <div>
                        <p className="label-upper mb-1.5">Table Number</p>
                        <input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="e.g. Table 4" className="input" />
                      </div>
                    )}
                    {orderType === "takeaway" && (
                      <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: "var(--brand-light)" }}>
                        <span className="text-2xl">🏪</span>
                        <div>
                          <p className="text-[12px] font-bold" style={{ color: "var(--brand-dark)" }}>In-Store Pickup</p>
                          <p className="text-[11px]" style={{ color: "var(--brand)" }}>Ready in ~20 min at our main counter.</p>
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                      {[
                        ["Subtotal", `$${getSubtotal().toFixed(2)}`],
                        ["Tax (8.25%)", `$${getTax().toFixed(2)}`],
                        ...(orderType === "delivery" ? [["Delivery", `$${getDelivery().toFixed(2)}`]] : []),
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[12px]">
                          <span style={{ color: "var(--text-3)", fontWeight: 500 }}>{k}</span>
                          <span style={{ color: "var(--text-2)", fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2" style={{ borderTop: "1px solid var(--border-light)" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>Total</span>
                        <span style={{ fontSize: 16, fontWeight: 900, color: "var(--text-primary)" }}>${getTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className="btn-primary w-full py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2"
                    >
                      {isPlacingOrder
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                        : <>Place Order · ${getTotal().toFixed(2)}</>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ PROFILE ══════ */}
      {activeTab === "Profile" && (
        <div>
          <TopBar title="Profile" />
          <div className="px-5 pb-6 flex flex-col gap-4 max-w-xl mx-auto w-full">

            {/* Account card */}
            <div className="card p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0" style={{ background: "var(--brand)" }}>
                AS
              </div>
              <div>
                <p className="heading-sm">{customerName}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>alice.smith@example.com</p>
                <span className="badge badge-brand mt-2 inline-block">Silver Member</span>
              </div>
            </div>

            {/* Loyalty */}
            <div className="card p-5">
              <div className="flex justify-between items-center mb-3">
                <p className="heading-sm">Rewards</p>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)" }}>280 / 500 pts</span>
              </div>
              <div className="w-full h-2 rounded-full mb-2" style={{ background: "var(--surface-3)" }}>
                <div className="h-full rounded-full" style={{ width: "56%", background: "var(--brand)" }} />
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>
                220 more points until Gold — unlock free items every Sunday.
              </p>
            </div>

            {/* Order history */}
            <div>
              <h3 className="heading-sm mb-3">Order History</h3>
              {pastOrders.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-[13px]" style={{ color: "var(--text-3)" }}>No completed orders yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {pastOrders.map(order => (
                    <div key={order.id} className="card p-4">
                      <div className="flex justify-between items-start mb-3 pb-2" style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <div>
                          <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>{order.id}</p>
                          <p className="label-upper mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="badge badge-success">Delivered</span>
                      </div>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[12px] py-0.5">
                          <span style={{ color: "var(--text-2)" }}>{item.quantity}× {item.name}</span>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 mt-1" style={{ borderTop: "1px solid var(--border-light)" }}>
                        <span className="label-upper">{order.type}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Cake Builder Sheet */}
      <BottomSheet isOpen={isCakeBuilderOpen} onClose={() => setIsCakeBuilderOpen(false)} title="Cake Configurator" height="full">
        <div className="flex flex-col gap-5 pb-6">
          <div className="rounded-2xl p-4 text-center" style={{ background: "var(--brand-light)" }}>
            <span className="text-3xl">🎂</span>
            <p className="text-[13px] font-semibold mt-2" style={{ color: "var(--brand-dark)" }}>
              Base price $25 · +$10/lb above 2 lbs
            </p>
          </div>

          <div>
            <p className="label-upper mb-2">Weight</p>
            <div className="grid grid-cols-4 gap-2">
              {["1", "2", "3", "5"].map(w => (
                <button
                  key={w}
                  onClick={() => setCakeWeight(w)}
                  className="py-3 rounded-xl text-[13px] font-bold transition-all"
                  style={cakeWeight === w
                    ? { background: "var(--text-primary)", color: "#fff" }
                    : { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }
                  }
                >
                  {w} lb
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label-upper mb-2">Flavor</p>
            <select
              value={cakeFlavor}
              onChange={e => setCakeFlavor(e.target.value)}
              className="input"
            >
              {["Chocolate Truffle", "Black Forest Cherry", "Red Velvet Fudge", "Vanilla Pineapple Custard"].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="label-upper mb-2">Icing Text / Instructions</p>
            <textarea
              value={cakeInstructions}
              onChange={e => setCakeInstructions(e.target.value)}
              placeholder="e.g. 'Happy Birthday Sarah' in pink frosting…"
              className="input h-20 py-3"
              style={{ height: "auto", resize: "none" }}
              rows={3}
            />
          </div>

          <button onClick={handleAddCustomCake} className="btn-primary w-full py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2">
            Add to Cart <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
