import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext(undefined);

// High-fidelity Unsplash images for MNC feel
const initialProducts = [
  {
    id: "PROD-1",
    name: "Chocolate Truffle Cake",
    description: "Rich chocolate layers with smooth Belgian chocolate ganache filling.",
    price: 25.00,
    category: "Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
    isCustomizable: true,
    available: true,
  },
  {
    id: "PROD-2",
    name: "Classic Croissant",
    description: "Flaky, buttery French pastry baked fresh daily.",
    price: 3.50,
    category: "Breads",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80",
    available: true,
  },
  {
    id: "PROD-3",
    name: "Strawberry Tart",
    description: "Sweet pastry shell filled with vanilla custard and fresh glazed strawberries.",
    price: 4.50,
    category: "Pastries",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?w=500&q=80",
    available: true,
  },
  {
    id: "PROD-4",
    name: "Garlic Sourdough",
    description: "Artisanal sourdough bread with roasted garlic cloves and fresh herbs.",
    price: 6.00,
    category: "Breads",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80",
    available: true,
  },
  {
    id: "PROD-5",
    name: "Iced Caramel Macchiato",
    description: "Freshly pulled espresso with milk and vanilla syrup, topped with caramel drizzle.",
    price: 4.95,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80",
    available: true,
  },
  {
    id: "PROD-6",
    name: "Avocado Toast & Egg",
    description: "Thick sourdough slice with mashed avocado, cherry tomatoes, and a poached egg.",
    price: 12.00,
    category: "Meals",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80",
    available: true,
  },
];

// Initial mock orders representing different stages
const initialOrders = [
  {
    id: "ORD-9801",
    customerName: "Alice Smith",
    items: [{ id: "PROD-1", name: "Chocolate Truffle Cake", quantity: 1, price: 25.00 }],
    total: 25.00,
    status: "pending",
    type: "delivery",
    address: "123 Main St, Springfield",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "ORD-9802",
    customerName: "Bob Jones",
    items: [{ id: "PROD-2", name: "Classic Croissant", quantity: 2, price: 3.50 }],
    total: 7.00,
    status: "ready",
    type: "takeaway",
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  }
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);

  // Order management
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const claimOrder = (id, driverId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id && order.status === "ready" && order.type === "delivery"
          ? { ...order, status: "delivering", driverId }
          : order
      )
    );
  };

  // Product management
  const addProduct = (prodData) => {
    const newProduct = {
      ...prodData,
      id: `PROD-${products.length + 1}`,
      available: true,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const toggleProductAvailability = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  const updateProductPrice = (id, price) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price } : p))
    );
  };

  // Cart actions
  const addToCart = (product, quantity = 1, customDetails) => {
    setCart((prev) => {
      // Check if product is already in cart (with same flavor/instructions if custom)
      const existingIndex = prev.findIndex((item) => {
        if (item.product.id !== product.id) return false;
        if (customDetails || item.customDetails) {
          return (
            item.customDetails?.flavor === customDetails?.flavor &&
            item.customDetails?.weight === customDetails?.weight &&
            item.customDetails?.instructions === customDetails?.instructions
          );
        }
        return true;
      });

      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += quantity;
        return nextCart;
      }

      return [...prev, { product, quantity, customDetails }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        products,
        cart,
        addOrder,
        updateOrderStatus,
        claimOrder,
        addProduct,
        toggleProductAvailability,
        updateProductPrice,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
