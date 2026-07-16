import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  BarChart2, ShoppingCart, Package, Settings, Menu, X,
  Layers, CreditCard, ExternalLink, Copy, Check, Bell,
  Share2, ArrowUpRight, HelpCircle, FileText, Sparkles,
  CheckCircle, AlertCircle, Search, Filter, Download,
  Megaphone, Wallet, Truck, Image, Tag, Percent, Globe, Upload, Camera, Clock,
  Database, Link2, FileSpreadsheet, Play, Trash2, AlertTriangle, Loader2, Plus, TrendingUp, Users2, RefreshCw, LogOut,
  MessageCircle, Grid3X3
} from "lucide-react";
import axios from "axios";

// Import tab subcomponents (all live under store-owner/tabs/)
import OverviewTab from "./store-owner/tabs/OverviewTab";
import OrdersTab from "./store-owner/tabs/OrdersTab";
import CatalogTab from "./store-owner/tabs/CatalogTab";
import PricesTab from "./store-owner/tabs/PricesTab";
import CampaignsTab from "./store-owner/tabs/CampaignsTab";
import SettingsTab from "./store-owner/tabs/SettingsTab";
import BalanceTab from "./store-owner/tabs/BalanceTab";
import AnalyticsTab from "./store-owner/tabs/AnalyticsTab";
import StaffTab from "./store-owner/tabs/StaffTab";
import AddProductTab from "./store-owner/tabs/AddProductTab";

export default function StoreOwnerProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sync active tab state from path
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard") setActiveTab("overview");
    else if (path === "/orders") setActiveTab("orders");
    else if (path === "/catalog") setActiveTab("catalog");
    else if (path === "/prices") setActiveTab("prices");
    else if (path === "/campaigns") setActiveTab("campaigns");
    else if (path === "/analytics") setActiveTab("analytics");
    else if (path === "/balance") setActiveTab("balance");
    else if (path === "/staff") setActiveTab("staff");
    else if (path === "/settings") setActiveTab("settings");
    else if (path === "/products/new") setActiveTab("add-product");
  }, [location.pathname]);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isOwnerAuthenticated") === "true";
  });

  const [slug, setSlug] = useState(() => localStorage.getItem("ownerStoreSlug") || "");
  const [storeData, setStoreData] = useState(null);

  // Real-time stats
  const [productsList, setProductsList] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [salesTotal, setSalesTotal] = useState(0);

  // Orders list and filters
  const [ordersList, setOrdersList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderTimeFilter, setOrderTimeFilter] = useState("all-time");

  // Prices tab filters & edits
  const [priceSearchQuery, setPriceSearchQuery] = useState("");
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPriceVal, setTempPriceVal] = useState("");

  // Add Product edit mode
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState("");

  // Campaigns tab states
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [campaignType, setCampaignType] = useState("campaigns"); // campaigns, promo

  // Form states (Settings tab)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [tagline, setTagline] = useState("");
  const [softwareType, setSoftwareType] = useState("restaurant");
  const [subscriptionPlan, setSubscriptionPlan] = useState("basic");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState(""); // base64 or URL
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("India — ₹ INR");
  const [timezone, setTimezone] = useState("India (IST)");
  const [language, setLanguage] = useState("English");
  const [customDomain, setCustomDomain] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [isTestingMode, setIsTestingMode] = useState(false);
  const [newOrderAlerts, setNewOrderAlerts] = useState(true);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [vibrationAlertsEnabled, setVibrationAlertsEnabled] = useState(true);
  const [checkoutMode, setCheckoutMode] = useState("website");

  // Nested Settings sub-tab state
  const [settingsSubTab, setSettingsSubTab] = useState("general"); // general, billing, payments, shipping, checkout, banners

  // Payments / Shipping options
  const [codEnabled, setCodEnabled] = useState(true);
  const [upiId, setUpiId] = useState("");
  const [bankAccountHolder, setBankAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [selfPickup, setSelfPickup] = useState(true);

  // UX states
  const [activeTab, setActiveTab] = useState("overview"); // overview, orders, catalog, prices, campaigns, balance, settings
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState(() => {
    try {
      const stored = localStorage.getItem("ownerWithdrawalRequests");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Add Product form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("");
  const [newProdDescription, setNewProdDescription] = useState("");
  const [newProdBrand, setNewProdBrand] = useState("");
  const [newProdTags, setNewProdTags] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdAvailability, setNewProdAvailability] = useState("Show");
  const [newProdWeight, setNewProdWeight] = useState("");
  const [newProdPackageSize, setNewProdPackageSize] = useState("");
  const [newProdFlavor, setNewProdFlavor] = useState("");
  const [newProdOrigin, setNewProdOrigin] = useState("");
  const [newProdDietaryInfo, setNewProdDietaryInfo] = useState("");
  const [newProdImage, setNewProdImage] = useState("");
  const [newProdVariants, setNewProdVariants] = useState([]);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [customCategories, setCustomCategories] = useState([]);
  const [customVariantInput, setCustomVariantInput] = useState("");

  // Variants quick-add states
  const [variantInputText, setVariantInputText] = useState("");
  const [variantInputUnit, setVariantInputUnit] = useState("KG");

  // Restaurant-specific product fields
  const [newProdVegType, setNewProdVegType] = useState("veg");       // veg | non-veg | vegan | egg
  const [newProdPrepTime, setNewProdPrepTime] = useState("");          // minutes
  const [newProdSpiceLevel, setNewProdSpiceLevel] = useState("none"); // none | mild | medium | hot | extra-hot
  const [newProdAllergens, setNewProdAllergens] = useState([]);        // ["Nuts", "Dairy", ...]
  const [newProdAddons, setNewProdAddons] = useState([]);              // [{name, price}]
  const [newProdAvailSchedule, setNewProdAvailSchedule] = useState("always");

  // Inline catalog edit state
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditName, setInlineEditName] = useState("");
  const [inlineEditPrice, setInlineEditPrice] = useState("");
  const [catalogFilter, setCatalogFilter] = useState("all");

  // Settings — operational
  const [storeIsOpen, setStoreIsOpen] = useState(true);
  const [minOrderAmount, setMinOrderAmount] = useState(0);
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(0);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("30-45 mins");
  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
    { day: "Sunday", isOpen: true, openTime: "10:00", closeTime: "23:00" }
  ]);

  // Google Sheets state variables
  const [gsheetIdInput, setGsheetIdInput] = useState("");
  const [gsheetStatusData, setGsheetStatusData] = useState({
    googleSheetId: "",
    googleSheetLastSync: null,
    googleSheetSyncStatus: "idle",
    googleSheetSyncMetrics: { imported: 0, updated: 0, errorsCount: 0, errorsList: [] },
    googleSheetAutoSync: false
  });
  const [gsheetLoading, setGsheetLoading] = useState(false);

  // Staff management states
  const [staffList, setStaffList] = useState([]);
  const [staffForm, setStaffForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffSuccess, setStaffSuccess] = useState("");
  const [staffError, setStaffError] = useState("");

  const applyFallbackDashboardState = (fallbackSlug = slug || localStorage.getItem("ownerStoreSlug") || "demo-store") => {
    const fallbackStore = {
      _id: "demo-store",
      name: localStorage.getItem("ownerStoreName") || "Demo Store",
      slug: fallbackSlug,
      email: localStorage.getItem("ownerEmail") || "demo@highp.in",
      softwareType: "restaurant",
      tagline: "Local demo workspace",
      logoUrl: "",
      faviconUrl: "",
      ownerName: "Demo Owner",
      phone: "",
      whatsappNumber: "",
      address: "",
      location: "India (IST)",
      language: "English",
      customDomain: "",
      isLive: true,
      isTestingMode: false,
      newOrderAlerts: true,
      soundAlertsEnabled: true,
      vibrationAlertsEnabled: true,
      bankAccountHolder: "",
      bankName: "",
      bankAccountNumber: "",
      bankIfsc: "",
      upiId: "",
      codEnabled: true,
      deliveryFee: 40,
      selfPickup: true,
      checkoutMode: "website",
      subscriptionPlan: "basic"
    };

    const fallbackProducts = [
      { _id: "demo-1", name: "Classic Burger", price: 180, discountPrice: 160, category: "Burgers", stock: 12, available: true },
      { _id: "demo-2", name: "Cold Coffee", price: 120, discountPrice: 100, category: "Beverages", stock: 8, available: true },
      { _id: "demo-3", name: "Paneer Wrap", price: 150, discountPrice: 140, category: "Wraps", stock: 10, available: true }
    ];

    const fallbackOrders = [
      { _id: "demo-order-1", customerName: "Asha", items: [{ name: "Classic Burger", quantity: 2 }], status: "completed", totalAmount: 360, createdAt: new Date().toISOString() },
      { _id: "demo-order-2", customerName: "Ravi", items: [{ name: "Cold Coffee", quantity: 1 }], status: "pending", totalAmount: 120, createdAt: new Date().toISOString() }
    ];

    setStoreData(fallbackStore);
    setName(fallbackStore.name);
    setTagline(fallbackStore.tagline || "");
    setSoftwareType(fallbackStore.softwareType || "restaurant");
    setSubscriptionPlan(fallbackStore.subscriptionPlan || "basic");
    setLogoUrl(fallbackStore.logoUrl || "");
    setFaviconUrl(fallbackStore.faviconUrl || "");
    setEmail(fallbackStore.email || "");
    setOwnerName(fallbackStore.ownerName || "");
    setPhone(fallbackStore.phone || "");
    setWhatsappNumber(fallbackStore.whatsappNumber || "");
    setAddress(fallbackStore.address || "");
    setLanguage(fallbackStore.language || "English");
    setCustomDomain(fallbackStore.customDomain || "");
    setIsLive(fallbackStore.isLive !== false);
    setIsTestingMode(fallbackStore.isTestingMode === true);
    setNewOrderAlerts(fallbackStore.newOrderAlerts !== false);
    setSoundAlertsEnabled(fallbackStore.soundAlertsEnabled !== false);
    setVibrationAlertsEnabled(fallbackStore.vibrationAlertsEnabled !== false);
    setBankAccountHolder(fallbackStore.bankAccountHolder || "");
    setBankName(fallbackStore.bankName || "");
    setBankAccountNumber(fallbackStore.bankAccountNumber || "");
    setBankIfsc(fallbackStore.bankIfsc || "");
    setUpiId(fallbackStore.upiId || "");
    setCodEnabled(fallbackStore.codEnabled !== false);
    setDeliveryFee(fallbackStore.deliveryFee !== undefined ? fallbackStore.deliveryFee : 40);
    setSelfPickup(fallbackStore.selfPickup !== false);
    setCheckoutMode(fallbackStore.checkoutMode || "website");
    setProductsList(fallbackProducts);
    setProductsCount(fallbackProducts.length);
    setOrdersList(fallbackOrders);
    setOrdersCount(fallbackOrders.length);
    setSalesTotal(fallbackOrders.reduce((sum, order) => sum + (order.status === "completed" || order.status === "delivered" ? (order.totalAmount || 0) : 0), 0));
    setWithdrawalRequests([]);
    localStorage.removeItem("ownerWithdrawalRequests");
    setErrorMsg("Showing local demo dashboard data because the backend is currently unavailable.");
  };

  const fetchStaffData = async () => {
    setStaffLoading(true);
    try {
      const res = await axios.get(`/api/stores/${slug}/staff`);
      setStaffList(res.data);
    } catch (err) {
      console.error("Failed to load staff list:", err);
    } finally {
      setStaffLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`/api/stores/${slug}/payouts`);
      setWithdrawalRequests(res.data);
    } catch (err) {
      console.error("Failed to load payout list:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "staff" && slug) {
      fetchStaffData();
    }
    if (activeTab === "balance" && slug) {
      fetchWithdrawals();
    }
  }, [activeTab, slug]);

  const fetchGsheetStatus = async () => {
    try {
      const res = await axios.get(`/api/gsheets/status/${slug}`);
      setGsheetStatusData(res.data);
      if (res.data.googleSheetId) {
        setGsheetIdInput(res.data.googleSheetId);
      }
    } catch (err) {
      console.error("Failed to load Google Sheets parameters:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "catalog" && slug) {
      fetchGsheetStatus();
    }
  }, [activeTab, slug]);

  const fetchStoreData = async () => {
    try {
      const res = await axios.get(`/api/stores/${slug}`);
      if (!res.data || Array.isArray(res.data) || !res.data.name) {
        throw new Error("Invalid store response received.");
      }
      setStoreData(res.data);
      setName(res.data.name);
      setTagline(res.data.tagline || "");
      setSoftwareType(res.data.softwareType || "restaurant");
      setSubscriptionPlan(res.data.subscriptionPlan || "basic");
      setLogoUrl(res.data.logoUrl || "");
      setFaviconUrl(res.data.faviconUrl || "");
      setEmail(res.data.email || "");
      setOwnerName(res.data.ownerName || "");
      setPhone(res.data.phone || "");
      setWhatsappNumber(res.data.whatsappNumber || "");
      setAddress(res.data.address || "");
      const locVal = res.data.location || "";
      if (locVal.includes("|")) {
        const parts = locVal.split("|");
        setCurrency(parts[0] || "India — ₹ INR");
        setTimezone(parts[1] || "India (IST)");
      } else {
        setCurrency("India — ₹ INR");
        setTimezone(locVal || "India (IST)");
      }
      setLanguage(res.data.language || "English");
      setCustomDomain(res.data.customDomain || "");
      setIsLive(res.data.isLive !== false);
      setIsTestingMode(res.data.isTestingMode === true);
      setNewOrderAlerts(res.data.newOrderAlerts !== false);
      setSoundAlertsEnabled(res.data.soundAlertsEnabled !== false);
      setVibrationAlertsEnabled(res.data.vibrationAlertsEnabled !== false);
      setBankAccountHolder(res.data.bankAccountHolder || "");
      setBankName(res.data.bankName || "");
      setBankAccountNumber(res.data.bankAccountNumber || "");
      setBankIfsc(res.data.bankIfsc || "");
      setUpiId(res.data.upiId || "");
      setCodEnabled(res.data.codEnabled !== false);
      setDeliveryFee(res.data.deliveryFee !== undefined ? res.data.deliveryFee : 40);
      setSelfPickup(res.data.selfPickup !== false);
      setCheckoutMode(res.data.checkoutMode || "website");
      setStoreIsOpen(res.data.storeIsOpen !== false);
      setMinOrderAmount(res.data.minOrderAmount || 0);
      setFreeDeliveryAbove(res.data.freeDeliveryAbove || 0);
      setEstimatedDeliveryTime(res.data.estimatedDeliveryTime || "30-45 mins");
      if (res.data.businessHours && res.data.businessHours.length === 7) {
        setBusinessHours(res.data.businessHours);
      }

      // Set default category from store type (using inline map)
      const categoryMap = {
        restaurant: "Starters", bakery: "Breads", restaurant_bakery: "Starters",
        cafe: "Hot Coffee", fastfood: "Burgers", juice_bar: "Fresh Juices",
        sweets_shop: "Barfi", ice_cream: "Cones", grocery: "Fruits",
        retail: "Apparel", pharmacy: "Medicines", electronics: "Mobiles",
        clothing: "Men", stationery: "Notebooks", salon: "Haircuts",
        gym: "Monthly Pass", water: "20L Jar", workshop: "Art & Craft",
        repair: "Mobile Repair", other: "Products",
      };
      setNewProdCategory(categoryMap[res.data.softwareType || "restaurant"] || "Products");

      // Fetch products count
      const pRes = await axios.get(`/api/products/${slug}`);
      setProductsList(pRes.data);
      setProductsCount(pRes.data.length);

      // Fetch orders list count & sales sum
      const oRes = await axios.get(`/api/orders/${slug}`);
      setOrdersList(oRes.data);
      setOrdersCount(oRes.data.length);
      const total = oRes.data.reduce((sum, order) => {
        if (order.status === "completed" || order.status === "delivered") {
          return sum + (order.totalAmount || 0);
        }
        return sum;
      }, 0);
      setSalesTotal(total);
    } catch (err) {
      console.error("Failed to load store data:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 404) {
        localStorage.removeItem("isOwnerAuthenticated");
        localStorage.removeItem("ownerStoreSlug");
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        applyFallbackDashboardState(slug);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !slug) {
      localStorage.removeItem("isOwnerAuthenticated");
      localStorage.removeItem("ownerStoreSlug");
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      fetchStoreData();
    }
  }, [isAuthenticated, slug]);

  // Hide toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCopyLink = () => {
    const storeUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("isOwnerAuthenticated");
    localStorage.removeItem("ownerStoreSlug");
    localStorage.removeItem("ownerEmail");
    localStorage.removeItem("ownerStoreName");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchStoreData(); // Refresh list & counters
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const handleConnectGsheet = async (e) => {
    e.preventDefault();
    if (!gsheetIdInput.trim()) return;
    setGsheetLoading(true);
    try {
      const res = await axios.post("/api/gsheets/connect", {
        storeSlug: slug,
        googleSheetId: gsheetIdInput.trim()
      });
      alert(res.data.message);
      fetchGsheetStatus();
      fetchStoreData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to link Google Sheet.");
    } finally {
      setGsheetLoading(false);
    }
  };

  const handleDisconnectGsheet = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Google Sheet? Your products list will remain, but automatic syncs will stop.")) return;
    setGsheetLoading(true);
    try {
      const res = await axios.post("/api/gsheets/disconnect", {
        storeSlug: slug
      });
      alert(res.data.message);
      setGsheetIdInput("");
      fetchGsheetStatus();
    } catch (err) {
      alert("Failed to decouple Google Sheet.");
    } finally {
      setGsheetLoading(false);
    }
  };

  const handleSyncGsheet = async () => {
    setGsheetLoading(true);
    try {
      const res = await axios.post("/api/gsheets/sync", {
        storeSlug: slug
      });
      alert("Synchronization process completed successfully.");
      fetchGsheetStatus();
      fetchStoreData();
    } catch (err) {
      alert(err.response?.data?.error || "Sync execution failed.");
      fetchGsheetStatus();
    } finally {
      setGsheetLoading(false);
    }
  };

  const handleResetGsheet = async () => {
    if (!window.confirm("CRITICAL WARNING: This will delete existing products and reset your Google Spreadsheet worksheets to the Master Catalog template. Do you wish to proceed?")) return;
    setGsheetLoading(true);
    try {
      const res = await axios.post("/api/gsheets/reset", {
        storeSlug: slug
      });
      alert("Spreadsheet catalog reset and template rows written successfully.");
      fetchGsheetStatus();
      fetchStoreData();
    } catch (err) {
      alert(err.response?.data?.error || "Reset execution failed.");
    } finally {
      setGsheetLoading(false);
    }
  };

  const handleToggleAutoSync = async (enabled) => {
    try {
      await axios.post("/api/gsheets/toggle-auto-sync", {
        storeSlug: slug,
        enabled
      });
      fetchGsheetStatus();
    } catch {
      alert("Failed to configure auto-sync parameters.");
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffError("");
    setStaffSuccess("");
    try {
      await axios.post(`/api/stores/${slug}/staff`, {
        name: staffForm.name,
        role: staffForm.role,
        email: staffForm.email,
        phone: staffForm.phone
      });
      setStaffSuccess("Staff member added successfully.");
      setStaffForm({ name: "", role: "", email: "", phone: "" });
      fetchStaffData();
    } catch (err) {
      setStaffError(err.response?.data?.error || "Failed to add staff member.");
    } finally {
      setStaffLoading(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await axios.delete(`/api/stores/${slug}/staff/${id}`);
      setStaffList(staffList.filter(s => s._id !== id));
    } catch (err) {
      alert("Failed to delete staff member.");
    }
  };

  const STORE_TYPE_CATEGORIES = {
    restaurant: ["Starters", "Mains", "Biryani", "Rice & Curries", "Sides", "Soups", "Snacks"],
    bakery: ["Breads", "Cakes", "Pastries", "Cookies & Biscuits", "Muffins", "Donuts", "Croissants", "Pies & Tarts", "Buns", "Drinks"],
    restaurant_bakery: [],
    cafe: ["Hot Coffee", "Cold Coffee", "Teas", "Juices", "Smoothies", "Sandwiches", "Wraps", "Pastries", "Cookies", "Cakes", "Snacks"],
    fastfood: ["Burgers", "Pizza", "Wraps", "Tacos", "Noodles", "Fried Items", "Sandwiches", "Rolls", "Snacks", "Drinks", "Combos"],
    juice_bar: ["Fresh Juices", "Smoothies", "Milkshakes", "Lassi", "Cold Pressed", "Mocktails", "Healthy Shots", "Shakes"],
    sweets_shop: ["Barfi", "Halwa", "Ladoo", "Pedha", "Gulab Jamun", "Rasgulla", "Kaju Katli", "Seasonal Sweets", "Namkeen", "Dry Fruits", "Drinks"],
    ice_cream: ["Cones", "Cups", "Sundaes", "Milkshakes", "Popsicles", "Kulfi", "Tubs", "Shakes", "Waffles"],
    grocery: ["Fruits", "Vegetables", "Dairy", "Beverages", "Snacks", "Grains & Rice", "Pulses", "Spices", "Oils", "Meat & Fish", "Frozen", "Personal Care", "Household"],
    retail: ["Apparel", "Footwear", "Electronics", "Home & Kitchen", "Toys", "Sports", "Beauty", "Bags", "Accessories", "Other"],
    pharmacy: ["Medicines", "Vitamins & Supplements", "Baby Care", "Personal Care", "Health Devices", "Ayurvedic", "First Aid", "Other"],
    electronics: ["Mobiles", "Laptops", "Accessories", "Cables & Chargers", "Audio", "Cameras", "Smart Devices", "Other"],
    clothing: ["Men", "Women", "Kids", "Traditional", "Western", "Sportswear", "Innerwear", "Accessories"],
    stationery: ["Notebooks", "Pens & Pencils", "Books", "Art Supplies", "Office Supplies", "Gift Items", "Other"],
    salon: ["Haircuts", "Hair Color", "Facials", "Massage", "Nail Art", "Waxing", "Threading", "Bridal Packages", "Skincare"],
    gym: ["Monthly Pass", "Quarterly Pass", "Annual Membership", "Personal Training", "Group Classes", "Nutrition Plans", "Supplements"],
    water: ["20L Jar", "5L Bottle", "1L Bottle", "Daily Plan", "Weekly Plan", "Monthly Plan", "Bulk Package"],
    workshop: ["Art & Craft", "Music", "Dance", "Coding", "Business Skills", "Fitness", "Photography", "Language", "Other"],
    repair: ["Mobile Repair", "Laptop Repair", "Appliance Repair", "Plumbing", "Electrical", "AC Service", "Other"],
    other: ["Products", "Services", "Packages", "Other"],
  };

  const getAvailableCategories = () => {
    if (!storeData) return ["Other"];
    const type = storeData.softwareType || "restaurant";
    return STORE_TYPE_CATEGORIES[type] || STORE_TYPE_CATEGORIES["other"];
  };

  const getAllCategoryOptions = () => {
    const defaultOptions = (storeData?.softwareType === "restaurant" || storeData?.softwareType === "restaurant_bakery")
      ? []
      : getAvailableCategories();
    return [...new Set([...defaultOptions, ...customCategories])];
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (getAllCategoryOptions().includes(trimmed)) {
      setNewProdCategory(trimmed);
      setCustomCategoryInput("");
      return;
    }
    setCustomCategories(prev => [...prev, trimmed]);
    setNewProdCategory(trimmed);
    setCustomCategoryInput("");
  };

  const handleRemoveCustomCategory = (category) => {
    setCustomCategories(prev => prev.filter(item => item !== category));
    if (newProdCategory === category) {
      setNewProdCategory("");
    }
  };

  const handleAddNewProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      alert("Product Name and Price are required.");
      return;
    }

    try {
      const payload = {
        storeSlug: slug,
        name: newProdName.trim(),
        price: parseFloat(newProdPrice),
        offerPrice: parseFloat(newProdDiscountPrice || "0"),
        category: newProdCategory,
        description: newProdDescription.trim(),
        brand: newProdBrand.trim(),
        unit: variantInputUnit || "pcs",
        stock: parseInt(newProdStock || "0", 10),
        status: newProdAvailability === "Show" ? "active" : "inactive",
        image: newProdImage.trim() || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        tags: newProdTags ? newProdTags.split(",").map(t => t.trim()).filter(Boolean) : [],
        weight: newProdWeight.trim(),
        packageSize: newProdPackageSize.trim(),
        flavor: newProdFlavor.trim(),
        origin: newProdOrigin.trim(),
        dietaryInfo: newProdDietaryInfo.trim(),
        // Restaurant-specific fields
        vegNonVeg: newProdVegType,
        prepTime: parseInt(newProdPrepTime || "0", 10),
        spiceLevel: newProdSpiceLevel,
        allergens: newProdAllergens,
        addons: newProdAddons.filter(a => a.name.trim()),
        availabilitySchedule: newProdAvailSchedule,
        variants: newProdVariants.map(v => ({
          variantLabel: v.variantLabel,
          unit: v.unit,
          price: parseFloat(v.price || newProdPrice),
          offerPrice: parseFloat(v.offerPrice || "0"),
          stock: parseInt(v.stock || "100", 10),
          sku: v.sku || "SKU-VAR-" + Math.floor(10000 + Math.random() * 90000)
        }))
      };

      if (!editingProductId) {
        payload.productId = "P" + Math.floor(1000 + Math.random() * 9000);
        payload.sku = "SKU-" + Math.floor(10000 + Math.random() * 90000);
      }

      if (editingProductId) {
        await axios.put(`/api/products/${editingProductId}`, payload);
        alert("Product successfully updated!");
        fetchStoreData();
        resetProductForm();
        navigate("/dashboard");
      } else {
        await axios.post("/api/products", payload);
        alert("Product successfully created!");
        resetProductForm();
        navigate("/prices");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || (editingProductId ? "Failed to update product." : "Failed to create new product entry."));
    }
  };

  const handleQuickAddVariants = () => {
    if (!variantInputText.trim()) return;
    const values = variantInputText.split(/[,\s]+/).map(v => v.trim()).filter(Boolean);
    const newItems = values.map(val => ({
      variantLabel: `${val} ${variantInputUnit}`,
      unit: variantInputUnit,
      price: newProdPrice ? parseFloat(newProdPrice) : 0,
      offerPrice: 0,
      stock: 100,
      sku: ""
    }));
    setNewProdVariants(prev => [...prev, ...newItems]);
    setVariantInputText("");
  };

  const handleAddCustomVariant = () => {
    const trimmed = customVariantInput.trim();
    if (!trimmed) return;

    const normalized = trimmed.replace(/\s+/g, " ").trim();
    const alreadyExists = newProdVariants.some(v => (v.variantLabel || "").toLowerCase() === normalized.toLowerCase());
    if (alreadyExists) {
      setCustomVariantInput("");
      return;
    }

    setNewProdVariants(prev => [
      ...prev,
      {
        variantLabel: normalized,
        unit: variantInputUnit,
        price: newProdPrice ? parseFloat(newProdPrice) : 0,
        offerPrice: 0,
        stock: 100,
        sku: "",
        isCustom: true
      }
    ]);
    setCustomVariantInput("");
  };

  const handleRemoveCustomVariant = (variant) => {
    setNewProdVariants(prev => prev.filter(v => !(v.isCustom && v.variantLabel === variant.variantLabel && v.unit === variant.unit && v.price === variant.price && v.stock === variant.stock)));
  };

  const resetProductForm = () => {
    setNewProdName(""); setNewProdPrice(""); setNewProdDiscountPrice("");
    setNewProdDescription(""); setNewProdBrand(""); setNewProdTags("");
    setNewProdStock(""); setNewProdWeight(""); setNewProdPackageSize("");
    setNewProdFlavor(""); setNewProdOrigin(""); setNewProdDietaryInfo("");
    setNewProdImage(""); setNewProdVariants([]); setVariantInputText(""); setCustomCategoryInput(""); setCustomVariantInput("");
    setNewProdVegType("veg"); setNewProdPrepTime(""); setNewProdSpiceLevel("none");
    setNewProdAllergens([]); setNewProdAddons([]); setNewProdAvailSchedule("always");
    setEditingProductId(null);
    setSelectedProductToEdit("");
  };

  const populateProductForm = (product) => {
    if (!product) return;
    setEditingProductId(product._id);
    setSelectedProductToEdit(product._id);
    setNewProdName(product.name || "");
    setNewProdPrice(product.price?.toString() || "");
    setNewProdDiscountPrice((product.offerPrice || product.discountPrice || "").toString());
    setNewProdCategory(product.category || "");
    setNewProdDescription(product.description || "");
    setNewProdBrand(product.brand || "");
    setNewProdTags(Array.isArray(product.tags) ? product.tags.join(", ") : (product.tags || ""));
    setNewProdStock(product.stock?.toString() || "");
    setNewProdAvailability(product.status === "inactive" ? "Hide" : "Show");
    setNewProdWeight(product.weight || "");
    setNewProdPackageSize(product.packageSize || "");
    setNewProdFlavor(product.flavor || "");
    setNewProdOrigin(product.origin || "");
    setNewProdDietaryInfo(product.dietaryInfo || "");
    setNewProdImage(product.image || "");
    setNewProdVariants(Array.isArray(product.variants) ? product.variants : []);
    setNewProdVegType(product.vegNonVeg || "veg");
    setNewProdPrepTime(product.prepTime?.toString() || "");
    setNewProdSpiceLevel(product.spiceLevel || "none");
    setNewProdAllergens(Array.isArray(product.allergens) ? product.allergens : []);
    setNewProdAddons(Array.isArray(product.addons) ? product.addons : []);
    setNewProdAvailSchedule(product.availabilitySchedule || "always");
  };

  const handleLoadProductForEdit = () => {
    if (!selectedProductToEdit) return;
    const product = productsList.find(p => p._id === selectedProductToEdit);
    if (!product) {
      alert("Selected product could not be found.");
      return;
    }
    populateProductForm(product);
    navigate(`/products/new?edit=${product._id}`);
  };

  const handleClearEditMode = () => {
    resetProductForm();
    navigate("/products/new");
  };

  useEffect(() => {
    if (location.pathname === "/products/new") {
      const params = new URLSearchParams(location.search);
      const editId = params.get("edit");
      if (editId && productsList.length > 0) {
        const product = productsList.find(p => p._id === editId);
        if (product) {
          populateProductForm(product);
        }
      }
    }
  }, [location.pathname, location.search, productsList]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Selected image is too large. Maximum size allowed is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProdImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Logo image is too large. Maximum 3MB allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLogoUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleExportOrders = () => {
    if (ordersList.length === 0) {
      alert("No orders available to export.");
      return;
    }
    const headers = ["Order ID", "Customer Name", "Items", "Total Amount", "Status", "Date"];
    const rows = ordersList.map(o => [
      o._id,
      o.customerName,
      o.items.map(item => `${item.name} (x${item.quantity})`).join("; "),
      o.totalAmount,
      o.status,
      new Date(o.createdAt).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prices updates
  const handleSavePriceChange = async (productId) => {
    try {
      const parsedPrice = parseFloat(tempPriceVal);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        alert("Please enter a valid price amount.");
        return;
      }

      const p = productsList.find(item => item._id === productId);
      await axios.put(`/api/products/${productId}`, {
        name: p.name,
        price: parsedPrice,
        description: p.description,
        image: p.image
      });

      setEditingPriceId(null);
      fetchStoreData();
      alert("Price updated and synced successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update product price.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.put(`/api/stores/${slug}`, {
        name,
        email,
        ownerName,
        tagline,
        softwareType,
        subscriptionPlan,
        logoUrl: logoUrl || undefined,
        faviconUrl: faviconUrl || undefined,
        phone,
        whatsappNumber,
        address,
        location: `${currency}|${timezone}`,
        language,
        customDomain,
        isLive,
        isTestingMode,
        newOrderAlerts,
        soundAlertsEnabled,
        vibrationAlertsEnabled,
        codEnabled,
        deliveryFee,
        selfPickup,
        upiId,
        checkoutMode,
        storeIsOpen,
        minOrderAmount,
        freeDeliveryAbove,
        estimatedDeliveryTime,
        businessHours
      });
      setStoreData(res.data);
      setSuccessMsg("Store profile updated successfully!");
    } catch (err) {
      setErrorMsg("Failed to update store parameters.");
    } finally {
      setUpdating(false);
    }
  };

  const saveWithdrawalRequests = (nextRequests) => {
    setWithdrawalRequests(nextRequests);
    localStorage.setItem("ownerWithdrawalRequests", JSON.stringify(nextRequests));
  };

  const handleSaveBankDetails = async (e) => {
    if (e) e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`/api/stores/${slug}`, {
        bankAccountHolder,
        bankName,
        bankAccountNumber,
        bankIfsc,
        upiId
      });
      setStoreData(res.data);
      setSuccessMsg("Bank account details saved successfully.");
      setErrorMsg("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save bank account details.");
      setSuccessMsg("");
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveOperationalSettings = async () => {
    setUpdating(true);
    try {
      const res = await axios.put(`/api/stores/${slug}`, {
        storeIsOpen,
        minOrderAmount,
        freeDeliveryAbove,
        estimatedDeliveryTime,
        businessHours,
        deliveryFee,
        selfPickup
      });
      setStoreData(res.data);
      setSuccessMsg("Delivery & hours settings saved!");
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Failed to save operational settings.");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStoreOpen = async (val) => {
    setStoreIsOpen(val);
    try {
      await axios.put(`/api/stores/${slug}`, { storeIsOpen: val });
    } catch (err) {
      console.error("Failed to toggle store status.");
    }
  };

  const handleDuplicateProduct = async (product) => {
    try {
      const payload = {
        ...product,
        _id: undefined,
        storeSlug: slug,
        name: product.name + " (Copy)",
        productId: "P" + Math.floor(1000 + Math.random() * 9000),
        sku: "SKU-" + Math.floor(10000 + Math.random() * 90000),
      };
      delete payload._id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;
      await axios.post("/api/products", payload);
      fetchStoreData();
      setSuccessMsg("Product duplicated successfully!");
    } catch (err) {
      alert("Failed to duplicate product.");
    }
  };

  const handleToggleProductAvailability = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      await axios.put(`/api/products/${product._id}`, { ...product, status: newStatus });
      fetchStoreData();
    } catch (err) {
      alert("Failed to toggle product availability.");
    }
  };

  const handleSaveInlineEdit = async (productId) => {
    try {
      const product = productsList.find(p => p._id === productId);
      await axios.put(`/api/products/${productId}`, {
        ...product,
        name: inlineEditName || product.name,
        price: parseFloat(inlineEditPrice) || product.price
      });
      setInlineEditId(null);
      fetchStoreData();
    } catch (err) {
      alert("Failed to save product edit.");
    }
  };

  const handlePrintReceipt = (order) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const items = (order.items || []).map(i => `<tr><td>${i.name}</td><td>x${i.quantity}</td><td>₹${(i.price || 0) * i.quantity}</td></tr>`).join("");
    win.document.write(`
      <html><head><title>Receipt #${order._id?.slice(-6)}</title>
      <style>body{font-family:monospace;max-width:300px;margin:0 auto;padding:20px}
      h2{text-align:center;border-bottom:1px dashed #000;padding-bottom:8px}
      table{width:100%}td{padding:4px 2px}
      .total{border-top:1px dashed #000;font-weight:bold;margin-top:8px;padding-top:8px}
      .footer{text-align:center;font-size:11px;margin-top:16px}</style></head>
      <body>
      <h2>${storeData?.name || "Store"}</h2>
      <p style="text-align:center;font-size:12px">Order #${order._id?.slice(-6)}<br>${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Customer:</strong> ${order.customerName || "—"}<br>
      <strong>Phone:</strong> ${order.phone || "—"}<br>
      ${order.address ? `<strong>Address:</strong> ${order.address}` : ""}</p>
      <table><thead><tr><th style="text-align:left">Item</th><th>Qty</th><th>Price</th></tr></thead><tbody>${items}</tbody></table>
      <div class="total">Total: ₹${order.totalAmount || 0} | ${(order.paymentMethod || "COD").toUpperCase()}</div>
      ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ""}
      <div class="footer">Thank you! Powered by HighP Platform</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleRequestWithdrawal = async () => {
    const availableBalance = Number((salesTotal * 0.82).toFixed(2));

    if (!bankAccountHolder || !bankAccountNumber || !bankIfsc) {
      alert("Please complete your bank account details before requesting a payout.");
      return;
    }

    if (availableBalance <= 0) {
      alert("No available balance to withdraw right now.");
      return;
    }

    setUpdating(true);
    try {
      await axios.post(`/api/stores/${slug}/payouts`, {
        amount: availableBalance,
        accountHolder: bankAccountHolder,
        bankName: bankName || "Primary Bank",
        accountNumber: bankAccountNumber,
        ifscCode: bankIfsc
      });

      await fetchWithdrawals();
      setShowWithdrawModal(false);
      setSuccessMsg(`Withdrawal request submitted for ₹${availableBalance.toLocaleString("en-IN")}.`);
      setErrorMsg("");
      alert(`Withdrawal request submitted for ₹${availableBalance.toLocaleString("en-IN")}. It will be processed within 2–3 business days.`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to submit withdrawal request right now.");
      setSuccessMsg("");
    } finally {
      setUpdating(false);
    }
  };

  const handleTransferOwnership = () => {
    alert("Transfer owner feature is not yet connected. Use this control to assign store ownership to another user.");
  };

  const handleTestAlert = () => {
    if (soundAlertsEnabled) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const audioContext = new AudioContextClass();
          const masterGain = audioContext.createGain();
          masterGain.gain.setValueAtTime(0.08, audioContext.currentTime);
          masterGain.connect(audioContext.destination);

          const playTone = (freq, duration, delay = 0, type = "sawtooth") => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
            gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + delay + duration);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(audioContext.currentTime + delay);
            osc.stop(audioContext.currentTime + delay + duration);
          };

          playTone(980, 0.14, 0, "square");
          playTone(1320, 0.14, 0.14, "square");
          playTone(1480, 0.12, 0.28, "square");
          playTone(1100, 0.16, 0.42, "sawtooth");

          if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => { });
          }
        }
      } catch (err) {
        console.error("Unable to play alert sound:", err);
      }
    }

    if (vibrationAlertsEnabled && navigator.vibrate) {
      navigator.vibrate([120, 60, 120]);
    }

    alert("Test alert sent.");
  };

  const handleDeleteStore = async () => {
    const confirmed = window.confirm("Delete this store and all associated data permanently?");
    if (!confirmed) return;

    setUpdating(true);
    try {
      await axios.delete(`/api/stores/${storeData._id}`);
      localStorage.removeItem("isOwnerAuthenticated");
      localStorage.removeItem("ownerStoreSlug");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete store.");
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#D03D56] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] uppercase font-black tracking-widest text-[#737373]">Redirecting to sign in…</p>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4">
        <div className="w-10 h-10 border-2 border-[#D03D56] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-[10px] uppercase font-black tracking-widest text-[#737373]">Preparing your dashboard…</p>
        <button
          type="button"
          onClick={() => {
            applyFallbackDashboardState(slug || localStorage.getItem("ownerStoreSlug") || "demo-store");
          }}
          className="mt-4 rounded-xl border border-[#F0EEEB] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#D03D56]"
        >
          Continue with demo data
        </button>
      </div>
    );
  }

  const storeUrl = `${window.location.origin}/${slug}`;

  // Filtered orders list
  const filteredOrders = ordersList.filter(o => {
    if (statusFilter === "pending" && o.status !== "pending") return false;
    if (statusFilter === "confirmed" && o.status !== "preparing") return false;
    if (statusFilter === "out-for-delivery" && o.status !== "completed") return false;
    if (statusFilter === "cancelled" && o.status !== "cancelled") return false;

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchItems = o.items.some(item => item.name.toLowerCase().includes(q));
      if (!matchCustomer && !matchItems) return false;
    }

    if (orderTimeFilter !== "all-time") {
      const date = new Date(o.createdAt);
      const today = new Date();
      if (orderTimeFilter === "today") {
        if (date.toDateString() !== today.toDateString()) return false;
      } else if (orderTimeFilter === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() !== yesterday.toDateString()) return false;
      } else if (orderTimeFilter === "last-7-days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        if (date < sevenDaysAgo) return false;
      }
    }
    return true;
  });

  // Filtered prices list
  const filteredProducts = productsList.filter(p => {
    if (priceSearchQuery.trim()) {
      return p.name.toLowerCase().includes(priceSearchQuery.toLowerCase());
    }
    return true;
  });

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans flex relative overflow-x-hidden">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION (TOWNCART STYLE) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white border-r border-[#F0EEEB] transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-screen md:flex-shrink-0`}>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Logo & Store details */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
              {(logoUrl || storeData.logoUrl) ? (
                <img src={logoUrl || storeData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#D03D56] flex items-center justify-center text-white font-black text-sm">
                  {storeData.name?.charAt(0)?.toUpperCase() || "H"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-sm text-neutral-955 truncate uppercase tracking-tight">{storeData.name}</h3>
              <span className="text-[10px] text-[#737373] font-bold capitalize block mt-0.5">
                {{
                  restaurant: "Restaurant",
                  bakery: "Bakery",
                  restaurant_bakery: "Restaurant & Bakery",
                  cafe: "Café",
                  fastfood: "Fast Food / Street Food",
                  juice_bar: "Juice Bar",
                  sweets_shop: "Sweets & Mithai",
                  ice_cream: "Ice Cream Parlour",
                  grocery: "Grocery & Kirana",
                  retail: "Retail Shop",
                  pharmacy: "Pharmacy",
                  electronics: "Electronics Store",
                  clothing: "Clothing & Apparel",
                  stationery: "Stationery & Books",
                  salon: "Salon & Spa",
                  gym: "Gym & Fitness",
                  water: "Water Delivery",
                  workshop: "Workshop / Classes",
                  repair: "Repair Services",
                  other: "Store",
                }[storeData.softwareType] || "Store"}
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart2 },
              { id: "add-product", label: "Add Products", icon: Plus },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "catalog", label: "Catalog", icon: Package },
              { id: "prices", label: "Prices", icon: Tag },
              { id: "campaigns", label: "Campaigns", icon: Megaphone },
              { id: "balance", label: "Balance", icon: Wallet },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "staff", label: "Staff", icon: Users2 },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    const targetPath = tab.id === "overview"
                      ? "dashboard"
                      : tab.id === "add-product"
                        ? "products/new"
                        : tab.id;
                    navigate("/" + targetPath);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${isSelected
                    ? "bg-[#F7EBEF] text-[#D03D56]"
                    : "text-neutral-500 hover:text-neutral-955 hover:bg-[#FAFAFA]"
                    }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout CTA Section */}
          <div className="mt-4 pt-4 border-t border-[#F0EEEB]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer bg-[#F7EBEF] text-[#D03D56] hover:bg-[#D03D56] hover:text-white"
            >
              <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Bottom Platform Return Link & Signout */}
        <div className="p-6 border-t border-[#F0EEEB] space-y-3">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black text-neutral-500 hover:text-neutral-955 uppercase tracking-widest">
            ← Return to Hub
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT PANEL */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-[#F0EEEB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 gap-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2.5 hover:bg-neutral-50 rounded-xl text-neutral-700 focus:outline-none cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xs font-black uppercase tracking-widest text-[#737373] capitalize">
              {activeTab === "add-product" ? "Add Products" : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#pricing"
              className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-[#D03D56] text-white rounded-xl shadow-sm hover:bg-[#3F0712] transition-colors"
            >
              ★ Upgrade Plan
            </a>
            <button className="p-2.5 hover:bg-neutral-50 rounded-xl text-neutral-600 cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* VIEW BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-5xl">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <OverviewTab
              storeData={storeData}
              productsCount={productsCount}
              ordersCount={ordersCount}
              salesTotal={salesTotal}
              storeUrl={storeUrl}
              copied={copied}
              handleCopyLink={handleCopyLink}
              navigate={navigate}
            />
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === "orders" && (
            <OrdersTab
              ordersList={ordersList}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              orderSearchQuery={orderSearchQuery}
              setOrderSearchQuery={setOrderSearchQuery}
              orderTimeFilter={orderTimeFilter}
              setOrderTimeFilter={setOrderTimeFilter}
              handleExportOrders={handleExportOrders}
              filteredOrders={filteredOrders}
              storeData={storeData}
              handleUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {/* TAB 3: CATALOG */}
          {activeTab === "catalog" && location.pathname !== "/products/new" && (
            <CatalogTab
              gsheetStatusData={gsheetStatusData}
              gsheetIdInput={gsheetIdInput}
              setGsheetIdInput={setGsheetIdInput}
              gsheetLoading={gsheetLoading}
              handleConnectGsheet={handleConnectGsheet}
              handleDisconnectGsheet={handleDisconnectGsheet}
              handleToggleAutoSync={handleToggleAutoSync}
              handleSyncGsheet={handleSyncGsheet}
              handleResetGsheet={handleResetGsheet}
              slug={slug}
            />
          )}

          {/* TAB 4: PRICES */}
          {activeTab === "prices" && (
            <PricesTab
              priceSearchQuery={priceSearchQuery}
              setPriceSearchQuery={setPriceSearchQuery}
              filteredProducts={filteredProducts}
              editingPriceId={editingPriceId}
              setEditingPriceId={setEditingPriceId}
              tempPriceVal={tempPriceVal}
              setTempPriceVal={setTempPriceVal}
              handleSavePriceChange={handleSavePriceChange}
            />
          )}

          {/* TAB 5: CAMPAIGNS */}
          {activeTab === "campaigns" && (
            <CampaignsTab
              campaignType={campaignType}
              setCampaignType={setCampaignType}
              campaignSearchQuery={campaignSearchQuery}
              setCampaignSearchQuery={setCampaignSearchQuery}
            />
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <SettingsTab
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              ownerName={ownerName}
              setOwnerName={setOwnerName}
              tagline={tagline}
              setTagline={setTagline}
              softwareType={softwareType}
              setSoftwareType={setSoftwareType}
              subscriptionPlan={subscriptionPlan}
              setSubscriptionPlan={setSubscriptionPlan}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              faviconUrl={faviconUrl}
              setFaviconUrl={setFaviconUrl}
              phone={phone}
              setPhone={setPhone}
              whatsappNumber={whatsappNumber}
              setWhatsappNumber={setWhatsappNumber}
              address={address}
              setAddress={setAddress}
              currency={currency}
              setCurrency={setCurrency}
              timezone={timezone}
              setTimezone={setTimezone}
              language={language}
              setLanguage={setLanguage}
              customDomain={customDomain}
              setCustomDomain={setCustomDomain}
              isLive={isLive}
              setIsLive={setIsLive}
              isTestingMode={isTestingMode}
              setIsTestingMode={setIsTestingMode}
              newOrderAlerts={newOrderAlerts}
              setNewOrderAlerts={setNewOrderAlerts}
              soundAlertsEnabled={soundAlertsEnabled}
              setSoundAlertsEnabled={setSoundAlertsEnabled}
              vibrationAlertsEnabled={vibrationAlertsEnabled}
              setVibrationAlertsEnabled={setVibrationAlertsEnabled}
              checkoutMode={checkoutMode}
              setCheckoutMode={setCheckoutMode}
              settingsSubTab={settingsSubTab}
              setSettingsSubTab={setSettingsSubTab}
              codEnabled={codEnabled}
              setCodEnabled={setCodEnabled}
              upiId={upiId}
              setUpiId={setUpiId}
              deliveryFee={deliveryFee}
              setDeliveryFee={setDeliveryFee}
              selfPickup={selfPickup}
              setSelfPickup={setSelfPickup}
              copied={copied}
              setCopied={setCopied}
              updating={updating}
              errorMsg={errorMsg}
              successMsg={successMsg}
              slug={slug}
              handleUpdateProfile={handleUpdateProfile}
              handleLogoFileChange={handleLogoFileChange}
              handleTransferOwnership={handleTransferOwnership}
              handleTestAlert={handleTestAlert}
              handleDeleteStore={handleDeleteStore}
            />
          )}

          {/* TAB 7: BALANCE */}
          {activeTab === "balance" && (
            <BalanceTab
              salesTotal={salesTotal}
              ordersList={ordersList}
              withdrawalRequests={withdrawalRequests}
              bankAccountHolder={bankAccountHolder}
              setBankAccountHolder={setBankAccountHolder}
              bankName={bankName}
              setBankName={setBankName}
              bankAccountNumber={bankAccountNumber}
              setBankAccountNumber={setBankAccountNumber}
              bankIfsc={bankIfsc}
              setBankIfsc={setBankIfsc}
              upiId={upiId}
              setUpiId={setUpiId}
              showWithdrawModal={showWithdrawModal}
              setShowWithdrawModal={setShowWithdrawModal}
              updating={updating}
              handleExportOrders={handleExportOrders}
              handleSaveBankDetails={handleSaveBankDetails}
              handleRequestWithdrawal={handleRequestWithdrawal}
            />
          )}

          {/* TAB 8: ANALYTICS */}
          {activeTab === "analytics" && (
            <AnalyticsTab
              salesTotal={salesTotal}
              ordersList={ordersList}
              productsCount={productsCount}
              slug={slug}
            />
          )}

          {/* TAB 9: STAFF */}
          {activeTab === "staff" && (
            <StaffTab
              staffForm={staffForm}
              setStaffForm={setStaffForm}
              staffSuccess={staffSuccess}
              staffError={staffError}
              staffList={staffList}
              staffLoading={staffLoading}
              handleAddStaff={handleAddStaff}
              handleDeleteStaff={handleDeleteStaff}
            />
          )}

          {/* TAB 10: ADD PRODUCT */}
          {location.pathname === "/products/new" && (
            <AddProductTab
              newProdName={newProdName}
              setNewProdName={setNewProdName}
              newProdPrice={newProdPrice}
              setNewProdPrice={setNewProdPrice}
              newProdDiscountPrice={newProdDiscountPrice}
              setNewProdDiscountPrice={setNewProdDiscountPrice}
              newProdCategory={newProdCategory}
              setNewProdCategory={setNewProdCategory}
              newProdDescription={newProdDescription}
              setNewProdDescription={setNewProdDescription}
              newProdBrand={newProdBrand}
              setNewProdBrand={setNewProdBrand}
              newProdTags={newProdTags}
              setNewProdTags={setNewProdTags}
              newProdStock={newProdStock}
              setNewProdStock={setNewProdStock}
              newProdAvailability={newProdAvailability}
              setNewProdAvailability={setNewProdAvailability}
              newProdWeight={newProdWeight}
              setNewProdWeight={setNewProdWeight}
              newProdPackageSize={newProdPackageSize}
              setNewProdPackageSize={setNewProdPackageSize}
              newProdFlavor={newProdFlavor}
              setNewProdFlavor={setNewProdFlavor}
              newProdOrigin={newProdOrigin}
              setNewProdOrigin={setNewProdOrigin}
              newProdDietaryInfo={newProdDietaryInfo}
              setNewProdDietaryInfo={setNewProdDietaryInfo}
              newProdImage={newProdImage}
              setNewProdImage={setNewProdImage}
              newProdVariants={newProdVariants}
              setNewProdVariants={setNewProdVariants}
              customCategoryInput={customCategoryInput}
              setCustomCategoryInput={setCustomCategoryInput}
              customCategories={customCategories}
              variantInputText={variantInputText}
              setVariantInputText={setVariantInputText}
              variantInputUnit={variantInputUnit}
              setVariantInputUnit={setVariantInputUnit}
              customVariantInput={customVariantInput}
              setCustomVariantInput={setCustomVariantInput}
              newProdVegType={newProdVegType}
              setNewProdVegType={setNewProdVegType}
              newProdPrepTime={newProdPrepTime}
              setNewProdPrepTime={setNewProdPrepTime}
              newProdSpiceLevel={newProdSpiceLevel}
              setNewProdSpiceLevel={setNewProdSpiceLevel}
              newProdAllergens={newProdAllergens}
              setNewProdAllergens={setNewProdAllergens}
              newProdAddons={newProdAddons}
              setNewProdAddons={setNewProdAddons}
              newProdAvailSchedule={newProdAvailSchedule}
              setNewProdAvailSchedule={setNewProdAvailSchedule}
              editingProductId={editingProductId}
              selectedProductToEdit={selectedProductToEdit}
              setSelectedProductToEdit={setSelectedProductToEdit}
              productsList={productsList}
              storeData={storeData}
              handleAddNewProductSubmit={handleAddNewProductSubmit}
              handleClearEditMode={handleClearEditMode}
              handleLoadProductForEdit={handleLoadProductForEdit}
              handleImageFileChange={handleImageFileChange}
              handleQuickAddVariants={handleQuickAddVariants}
              handleAddCustomVariant={handleAddCustomVariant}
              handleRemoveCustomVariant={handleRemoveCustomVariant}
              handleAddCustomCategory={handleAddCustomCategory}
              handleRemoveCustomCategory={handleRemoveCustomCategory}
              getAllCategoryOptions={getAllCategoryOptions}
              navigate={navigate}
            />
          )}

        </main>
      </div>

      {/* FLOATING SUCCESS TOAST (TOWNCART STYLE) */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-55 bg-white border border-[#F0EEEB] text-neutral-900 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider block">Verified successfully!</span>
            <span className="text-[9px] text-[#737373] font-bold block">Connected to MongoDB Multi-Tenant Cluster</span>
          </div>
        </div>
      )}

    </div>
  );
}
