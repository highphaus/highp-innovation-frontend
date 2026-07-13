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
  
  // Variants quick-add states
  const [variantInputText, setVariantInputText] = useState("");
  const [variantInputUnit, setVariantInputUnit] = useState("KG");

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

  useEffect(() => {
    if (activeTab === "staff" && slug) {
      fetchStaffData();
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
    restaurant:         ["Starters", "Mains", "Biryani", "Breads", "Rice & Curries", "Sides", "Soups", "Desserts", "Drinks", "Combos", "Snacks"],
    bakery:             ["Breads", "Cakes", "Pastries", "Cookies & Biscuits", "Muffins", "Donuts", "Croissants", "Pies & Tarts", "Buns", "Savory Bakes", "Drinks"],
    restaurant_bakery:  ["Starters", "Mains", "Breads", "Cakes", "Pastries", "Cookies", "Desserts", "Drinks", "Combos", "Snacks", "Savory Bakes"],
    cafe:               ["Hot Coffee", "Cold Coffee", "Teas", "Juices", "Smoothies", "Sandwiches", "Wraps", "Pastries", "Cookies", "Cakes", "Snacks"],
    fastfood:           ["Burgers", "Pizza", "Wraps", "Tacos", "Noodles", "Fried Items", "Sandwiches", "Rolls", "Snacks", "Drinks", "Combos"],
    juice_bar:          ["Fresh Juices", "Smoothies", "Milkshakes", "Lassi", "Cold Pressed", "Mocktails", "Healthy Shots", "Shakes"],
    sweets_shop:        ["Barfi", "Halwa", "Ladoo", "Pedha", "Gulab Jamun", "Rasgulla", "Kaju Katli", "Seasonal Sweets", "Namkeen", "Dry Fruits", "Drinks"],
    ice_cream:          ["Cones", "Cups", "Sundaes", "Milkshakes", "Popsicles", "Kulfi", "Tubs", "Shakes", "Waffles"],
    grocery:            ["Fruits", "Vegetables", "Dairy", "Beverages", "Snacks", "Grains & Rice", "Pulses", "Spices", "Oils", "Meat & Fish", "Frozen", "Personal Care", "Household"],
    retail:             ["Apparel", "Footwear", "Electronics", "Home & Kitchen", "Toys", "Sports", "Beauty", "Bags", "Accessories", "Other"],
    pharmacy:           ["Medicines", "Vitamins & Supplements", "Baby Care", "Personal Care", "Health Devices", "Ayurvedic", "First Aid", "Other"],
    electronics:        ["Mobiles", "Laptops", "Accessories", "Cables & Chargers", "Audio", "Cameras", "Smart Devices", "Other"],
    clothing:           ["Men", "Women", "Kids", "Traditional", "Western", "Sportswear", "Innerwear", "Accessories"],
    stationery:         ["Notebooks", "Pens & Pencils", "Books", "Art Supplies", "Office Supplies", "Gift Items", "Other"],
    salon:              ["Haircuts", "Hair Color", "Facials", "Massage", "Nail Art", "Waxing", "Threading", "Bridal Packages", "Skincare"],
    gym:                ["Monthly Pass", "Quarterly Pass", "Annual Membership", "Personal Training", "Group Classes", "Nutrition Plans", "Supplements"],
    water:              ["20L Jar", "5L Bottle", "1L Bottle", "Daily Plan", "Weekly Plan", "Monthly Plan", "Bulk Package"],
    workshop:           ["Art & Craft", "Music", "Dance", "Coding", "Business Skills", "Fitness", "Photography", "Language", "Other"],
    repair:             ["Mobile Repair", "Laptop Repair", "Appliance Repair", "Plumbing", "Electrical", "AC Service", "Other"],
    other:              ["Products", "Services", "Packages", "Other"],
  };

  const getAvailableCategories = () => {
    if (!storeData) return ["Other"];
    const type = storeData.softwareType || "restaurant";
    return STORE_TYPE_CATEGORIES[type] || STORE_TYPE_CATEGORIES["other"];
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
        productId: "P" + Math.floor(1000 + Math.random() * 9000),
        name: newProdName.trim(),
        price: parseFloat(newProdPrice),
        offerPrice: parseFloat(newProdDiscountPrice || "0"),
        category: newProdCategory,
        description: newProdDescription.trim(),
        brand: newProdBrand.trim(),
        sku: "SKU-" + Math.floor(10000 + Math.random() * 90000),
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
        variants: newProdVariants.map(v => ({
          variantLabel: v.variantLabel,
          unit: v.unit,
          price: parseFloat(v.price || newProdPrice),
          offerPrice: parseFloat(v.offerPrice || "0"),
          stock: parseInt(v.stock || "100", 10),
          sku: v.sku || "SKU-VAR-" + Math.floor(10000 + Math.random() * 90000)
        }))
      };

      await axios.post("/api/products", payload);
      alert("Product successfully created!");
      
      // Clear form
      setNewProdName("");
      setNewProdPrice("");
      setNewProdDiscountPrice("");
      setNewProdDescription("");
      setNewProdBrand("");
      setNewProdTags("");
      setNewProdStock("");
      setNewProdWeight("");
      setNewProdPackageSize("");
      setNewProdFlavor("");
      setNewProdOrigin("");
      setNewProdDietaryInfo("");
      setNewProdImage("");
      setNewProdVariants([]);
      setVariantInputText("");

      navigate("/prices");
      fetchStoreData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create new product entry.");
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
    setNewProdVariants([...newProdVariants, ...newItems]);
    setVariantInputText("");
  };

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
        checkoutMode
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
      const request = {
        id: `payout-${Date.now()}`,
        amount: availableBalance,
        accountHolder: bankAccountHolder,
        bankName: bankName || "Primary Bank",
        status: "Requested",
        requestedAt: new Date().toISOString()
      };

      const nextRequests = [request, ...withdrawalRequests].slice(0, 8);
      saveWithdrawalRequests(nextRequests);
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
            audioContext.resume().catch(() => {});
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

  if (!storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D03D56] mb-3" />
        <p className="text-[10px] uppercase font-black tracking-widest text-[#737373] animate-pulse">Loading Dashboard Workspace...</p>
      </div>
    );
  }

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
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-white border-r border-[#F0EEEB] transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:h-screen md:flex-shrink-0`}>
        
        <div className="p-6 space-y-8">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected 
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
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-[#F0EEEB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 gap-2">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={toggleSidebar}
              className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-600 focus:outline-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
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
            <button className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-450 cursor-pointer">
              <Bell className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* VIEW BODY */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-5xl">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-up">
              
              {/* Welcome header */}
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-neutral-955 tracking-tight uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Welcome back, {storeData.email ? storeData.email.split('@')[0] : "Merchant"}
                </h1>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{storeData.name}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "PRODUCTS", val: productsCount, icon: Package, color: "text-[#D03D56] bg-[#F7EBEF]" },
                  { label: "ORDERS", val: ordersCount, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
                  { label: "SALES", val: "₹" + salesTotal, icon: BarChart2, color: "text-emerald-700 bg-emerald-50" }
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={idx} className="bg-white border border-[#F0EEEB] p-4 sm:p-6 rounded-3xl flex items-center justify-between shadow-sm gap-3">
                      <div className="space-y-2">
                        <span className="text-[9px] text-[#737373] uppercase tracking-widest font-black block">{s.label}</span>
                        <span className="text-3xl font-black block text-neutral-955">{s.val}</span>
                      </div>
                      <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Store Link Section */}
              <div className="bg-white border border-[#F0EEEB] rounded-3xl p-4 sm:p-8 space-y-6 shadow-sm">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-955">Store Link</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      readOnly
                      type="text" 
                      value={storeUrl}
                      className="flex-1 bg-[#FAFAFA] border border-[#F0EEEB] text-[#D03D56] font-mono px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="p-2.5 border border-[#F0EEEB] hover:border-[#D03D56]/40 rounded-xl text-neutral-600 hover:text-[#D03D56] transition-colors cursor-pointer bg-white"
                      title="Copy Link"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-650" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a 
                      href={storeUrl} target="_blank" rel="noreferrer"
                      className="p-2.5 border border-[#F0EEEB] hover:border-[#D03D56]/40 rounded-xl text-neutral-600 hover:text-[#D03D56] transition-colors bg-white flex items-center"
                      title="Open Storefront"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-[#F5F5F0] pt-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950">Share your store</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide mt-0.5">Share across social media for wider reach</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: "Facebook", bg: "bg-[#3B5998]" },
                      { label: "WhatsApp", bg: "bg-[#25D366]" },
                      { label: "Twitter", bg: "bg-[#1DA1F2]" },
                      { label: "LinkedIn", bg: "bg-[#0077B5]" }
                    ].map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => alert(`Sharing link: ${storeUrl} to ${s.label}`)}
                        className={`px-4 py-2 ${s.bg} text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 border border-[#F0EEEB] bg-[#FAFAFA] rounded-2xl flex items-center justify-center p-2 flex-shrink-0">
                  <svg className="w-full h-full text-neutral-800" viewBox="0 0 100 100">
                    <rect width="20" height="20" fill="currentColor"/>
                    <rect x="80" width="20" height="20" fill="currentColor"/>
                    <rect y="80" width="20" height="20" fill="currentColor"/>
                    <rect x="35" y="35" width="30" height="30" fill="currentColor"/>
                    <rect x="10" y="45" width="10" height="10" fill="currentColor"/>
                    <rect x="50" y="10" width="10" height="15" fill="currentColor"/>
                    <rect x="75" y="60" width="15" height="15" fill="currentColor"/>
                  </svg>
                </div>
                <div className="space-y-2.5 text-center sm:text-left">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-955">Store QR Code</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide mt-0.5">Click to view & download print-ready codes</p>
                  </div>
                  <button 
                    onClick={() => alert("Downloading print-ready store QR code...")}
                    className="px-4 py-2 border border-[#F0EEEB] hover:border-[#D03D56]/50 text-neutral-700 hover:text-neutral-955 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer bg-white"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#737373] ml-1">Quick Actions</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Add Product */}
                  <button 
                    onClick={() => navigate("/products/new")}
                    className="flex flex-col items-center justify-center gap-2.5 p-5 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Plus className="w-5 h-5 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Add Product</span>
                  </button>

                  {/* Import */}
                  <button 
                    onClick={() => navigate("/catalog")}
                    className="flex flex-col items-center justify-center gap-2.5 p-5 bg-white border border-[#F0EEEB] hover:bg-neutral-50 text-neutral-800 rounded-2xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Database className="w-5 h-5 text-neutral-700" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Import</span>
                  </button>

                  {/* Campaign */}
                  <button 
                    onClick={() => navigate("/campaigns")}
                    className="flex flex-col items-center justify-center gap-2.5 p-5 bg-white border border-[#F0EEEB] hover:bg-neutral-50 text-neutral-800 rounded-2xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Megaphone className="w-5 h-5 text-neutral-700" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Campaign</span>
                  </button>

                  {/* Promo */}
                  <button 
                    onClick={() => navigate("/campaigns")}
                    className="flex flex-col items-center justify-center gap-2.5 p-5 bg-white border border-[#F0EEEB] hover:bg-neutral-50 text-neutral-800 rounded-2xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Tag className="w-5 h-5 text-neutral-700" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Promo</span>
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-neutral-955 tracking-tight uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Orders
                </h1>
                <p className="text-xs text-neutral-450 font-bold uppercase tracking-widest">{ordersList.length} orders total</p>
              </div>

              <div className="border-b border-[#F0EEEB] flex gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {[
                  { id: "all", label: "All" },
                  { id: "pending", label: "Pending" },
                  { id: "confirmed", label: "Confirmed" },
                  { id: "out-for-delivery", label: "Out for Delivery" },
                  { id: "cancelled", label: "Cancelled" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
                      statusFilter === tab.id 
                        ? "border-[#D03D56] text-[#D03D56]" 
                        : "border-transparent hover:text-neutral-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="Search orders..."
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#F0EEEB] pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 transition-all font-semibold"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                    <select 
                      value={orderTimeFilter}
                      onChange={e => setOrderTimeFilter(e.target.value)}
                      className="bg-white border border-[#F0EEEB] text-neutral-800 pl-10 pr-8 py-2.5 text-xs rounded-xl focus:outline-none font-bold appearance-none cursor-pointer"
                    >
                      <option value="all-time">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="last-7-days">Last 7 Days</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportOrders}
                    className="px-4 py-2.5 border border-[#F0EEEB] hover:border-[#D03D56]/40 text-neutral-700 hover:text-neutral-950 rounded-xl text-xs font-bold transition-all bg-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-[#F0EEEB] rounded-3xl py-20 px-6 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wide">No orders found</h4>
                    <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest">Try adjusting your filters</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div key={order._id} className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-all">
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#D03D56] font-black uppercase">
                            #{order._id.substring(order._id.length - 8)}
                          </span>
                          <span className="text-[9px] text-[#737373] font-bold">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-neutral-955 uppercase">{order.customerName}</h4>
                          {order.phone && <p className="text-[9px] text-[#737373] font-mono mt-0.5">📞 {order.phone}</p>}
                          {order.address && <p className="text-[9px] text-neutral-500 font-semibold mt-0.5 max-w-xs">📍 {order.address}</p>}
                          <div className="text-[10px] text-neutral-500 font-bold mt-2 space-y-0.5">
                            {order.items.map((item, idx) => (
                              <p key={idx}>- {item.name} <span className="text-[#D03D56]">x{item.quantity}</span></p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 flex-shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] text-neutral-400 font-bold block">TOTAL AMOUNT</span>
                          <span className="text-base font-black text-neutral-950 block">₹{order.totalAmount}</span>
                        </div>
                        <div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            order.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            order.status === "preparing" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            order.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              order.status === "pending" ? "bg-amber-600" :
                              order.status === "preparing" ? "bg-blue-600" :
                              order.status === "completed" ? "bg-emerald-600" :
                              "bg-red-650"
                            }`} />
                            {order.status === "preparing" ? "Confirmed" : order.status === "completed" ? "Out for Delivery" : order.status}
                          </span>
                        </div>
                      </div>

                       <div className="flex gap-2.5 flex-shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 justify-end flex-wrap items-center">
                        {order.phone && (order.status === "pending" || order.status === "preparing") && (
                          <button
                            onClick={() => {
                              const msg = `Hello ${order.customerName}! This is ${storeData?.name || 'our store'}. Our delivery partners are currently busy. Your order will reach you in approximately 1 hour. We apologize for the delay!`;
                              window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="px-3.5 py-2 border border-amber-250 text-amber-700 bg-amber-50 hover:bg-amber-100 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Partners Busy (1h)
                          </button>
                        )}
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "preparing")}
                              className="px-3.5 py-2 bg-[#D03D56] text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-[#3F0712] transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "cancelled")}
                              className="px-3.5 py-2 border border-[#F0EEEB] text-red-650 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-red-50 hover:border-red-250 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === "preparing" && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "completed")}
                              className="px-3.5 py-2 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              Out for Delivery
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "cancelled")}
                              className="px-3.5 py-2 border border-[#F0EEEB] text-red-650 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-red-50 hover:border-red-250 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {(order.status === "completed" || order.status === "cancelled") && (
                          <span className="text-[10px] text-[#737373] font-bold uppercase tracking-wider block">No Actions Available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATALOG */}
          {activeTab === "catalog" && location.pathname !== "/products/new" && (
            <div className="space-y-6 animate-fade-up">
              
              {/* Header metrics */}
              <div className="flex justify-between items-center flex-wrap gap-4 pb-2">
                <div>
                  <h1 className="text-2xl font-black text-neutral-955 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Google Sheets catalog
                  </h1>
                  <p className="text-xs text-neutral-450 font-bold uppercase tracking-widest mt-0.5">
                    Sync and manage inventory worksheets in real-time
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKv1a6m35YdF3QRLsGPWlh621st-Y/copy"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 border border-[#F0EEEB] hover:bg-neutral-200 text-neutral-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Copy Template
                  </a>
                  {gsheetStatusData.googleSheetId && (
                    <a
                      href={`https://docs.google.com/spreadsheets/d/${gsheetStatusData.googleSheetId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 border border-[#F0EEEB] hover:bg-neutral-200 text-neutral-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Sheet
                    </a>
                  )}
                </div>
              </div>

              {/* Connection Status Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Connection Box */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Database className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Sheet Connection Config</h3>
                      <p className="text-[9px] text-[#737373] uppercase tracking-widest font-black mt-0.5">Database linkage</p>
                    </div>
                  </div>

                  {!gsheetStatusData.googleSheetId ? (
                    <form onSubmit={handleConnectGsheet} className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1 ml-0.5">
                          Google Spreadsheet ID
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. 1BxiMVs0XRA5nFMdKv1a6m35YdF3QRLsGPWlh621st-Y"
                          className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                          value={gsheetIdInput}
                          onChange={e => setGsheetIdInput(e.target.value)}
                        />
                        <span className="block text-[8px] text-neutral-450 leading-relaxed font-bold uppercase tracking-wider pl-0.5">
                          Tip: Ensure that the spreadsheet is open for editing, or share it with the highp-platform service account if using a restricted workspace.
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={gsheetLoading}
                        className="px-5 py-3 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        {gsheetLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                        <span>Connect Google Sheet</span>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      <div className="bg-[#FAFAFA] border border-[#F0EEEB] p-4.5 rounded-2xl space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-[#737373] uppercase font-black tracking-widest text-[9px]">Linked ID:</span>
                          <span className="text-neutral-900 font-bold break-all select-all">{gsheetStatusData.googleSheetId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#737373] uppercase font-black tracking-widest text-[9px]">Autosync check:</span>
                          <span className="text-neutral-900 font-bold uppercase">{gsheetStatusData.googleSheetAutoSync ? "Active (Every 5 mins)" : "Disabled"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={handleDisconnectGsheet}
                          disabled={gsheetLoading}
                          className="px-4 py-2.5 border border-red-200 text-red-650 hover:bg-red-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                        >
                          Disconnect Sheet
                        </button>
                        <button
                          onClick={() => handleToggleAutoSync(!gsheetStatusData.googleSheetAutoSync)}
                          className={`px-4 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm ${
                            gsheetStatusData.googleSheetAutoSync
                              ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                              : "border-[#F0EEEB] text-neutral-700 hover:bg-[#FAFAFA]"
                          }`}
                        >
                          {gsheetStatusData.googleSheetAutoSync ? "Disable Auto Sync" : "Enable Auto Sync"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Card */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm lg:col-span-1 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Sync Monitor</h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#737373] font-semibold text-[10px]">Sync Status</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          gsheetStatusData.googleSheetSyncStatus === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          gsheetStatusData.googleSheetSyncStatus === "syncing" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          gsheetStatusData.googleSheetSyncStatus === "failed" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-neutral-50 text-neutral-500 border-neutral-200"
                        }`}>
                          {gsheetStatusData.googleSheetSyncStatus}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#737373] font-semibold text-[10px]">Last Synced</span>
                        <span className="font-mono text-neutral-900 text-[10px] font-bold">
                          {gsheetStatusData.googleSheetLastSync 
                            ? new Date(gsheetStatusData.googleSheetLastSync).toLocaleTimeString() 
                            : "Never"}
                        </span>
                      </div>

                      <div className="h-px bg-[#F5F5F0]" />

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-[#FAFAFA] border border-[#F5F5F0] p-2.5 rounded-xl">
                          <span className="text-[8px] text-[#737373] font-black uppercase tracking-widest block">Imported</span>
                          <span className="text-sm font-black text-neutral-950 mt-1 block">
                            {gsheetStatusData.googleSheetSyncMetrics?.imported || 0}
                          </span>
                        </div>
                        <div className="bg-[#FAFAFA] border border-[#F5F5F0] p-2.5 rounded-xl">
                          <span className="text-[8px] text-[#737373] font-black uppercase tracking-widest block">Updated</span>
                          <span className="text-sm font-black text-neutral-955 mt-1 block">
                            {gsheetStatusData.googleSheetSyncMetrics?.updated || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {gsheetStatusData.googleSheetId && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-[#F5F5F0]">
                      <button
                        onClick={handleSyncGsheet}
                        disabled={gsheetLoading}
                        className="w-full py-2.5 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {gsheetLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>Sync Now</span>
                      </button>
                      <button
                        onClick={handleResetGsheet}
                        disabled={gsheetLoading}
                        className="w-full py-2.5 border border-[#F0EEEB] hover:border-red-200 text-neutral-700 hover:text-red-650 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reset Sheet Config</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation errors ledge */}
              {gsheetStatusData.googleSheetSyncMetrics?.errorsList?.length > 0 && (
                <div className="bg-white border border-red-150 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest">Worksheet Validation Ledger</h4>
                      <p className="text-[8px] text-red-500 font-black uppercase tracking-wider mt-0.5">
                        Please rectify the following errors on your spreadsheet to complete synchronization.
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50/40 border border-red-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-red-50 border-b border-red-100 text-[8px] font-black text-red-800 uppercase tracking-widest">
                          <th className="px-5 py-3 w-20">Row</th>
                          <th className="px-5 py-3">Error Explanation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-100 font-medium text-red-800">
                        {gsheetStatusData.googleSheetSyncMetrics.errorsList.map((err, index) => (
                          <tr key={index} className="hover:bg-red-50/50 transition-colors">
                            <td className="px-5 py-3 font-mono font-bold">#{err.row}</td>
                            <td className="px-5 py-3 text-[11px] font-semibold">{err.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Instructions Panel */}
              <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Worksheet Formatting Guide</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[11px] text-neutral-500 font-bold leading-relaxed">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-black text-neutral-950 uppercase tracking-wide">1. Column Layout</h4>
                    <p>Worksheet columns must exactly follow the order: Product ID, Name, Description, Category, Brand, SKU, Variant Label, Unit, Price, Offer Price, Stock, Image URL, Status, Featured, Tags.</p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-black text-neutral-955 uppercase tracking-wide">2. Hierarchical Variants</h4>
                    <p>To group items (e.g. Rice 1kg, 5kg), leave the <strong>Name</strong> field blank for variant rows placed immediately under the main parent row. Variant properties will map dynamically.</p>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-black text-neutral-955 uppercase tracking-wide">3. Worksheet Validations</h4>
                    <p>Ensure that all mapped Categories and Units match the values set inside the <strong>Categories</strong> and <strong>Units</strong> sheets to prevent parsing exclusions.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PRICES */}
          {activeTab === "prices" && (
            <div className="space-y-6 animate-fade-up">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-neutral-955 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Prices
                </h1>
                <p className="text-xs text-neutral-450 font-bold uppercase tracking-widest">Auto-saves and syncs directly to MongoDB and sheets</p>
              </div>

              {/* Search filter tool */}
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search products or variants..."
                  value={priceSearchQuery}
                  onChange={e => setPriceSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#F0EEEB] pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 transition-all font-semibold"
                />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#F0EEEB] rounded-3xl py-20 px-6 text-center space-y-4 shadow-sm">
                  <p className="text-neutral-400 text-xs font-bold uppercase tracking-wide">
                    No products yet. Add one from the Products page to set prices here.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-[#F0EEEB] rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAFAFA] border-b border-[#F0EEEB] text-[9px] font-black text-neutral-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Product Name</th>
                        <th className="px-6 py-4">Current Price</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F0]">
                      {filteredProducts.map(p => (
                        <tr key={p._id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 font-black text-neutral-950 uppercase">{p.name}</td>
                          <td className="px-6 py-4 font-mono font-bold text-neutral-900">
                            {editingPriceId === p._id ? (
                              <input 
                                type="number" 
                                value={tempPriceVal}
                                onChange={e => setTempPriceVal(e.target.value)}
                                className="w-24 px-2.5 py-1 bg-[#FAFAFA] border border-[#F0EEEB] rounded-lg text-xs font-bold focus:outline-none focus:border-[#D03D56]"
                              />
                            ) : (
                              <span>₹{p.price}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {editingPriceId === p._id ? (
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => handleSavePriceChange(p._id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider rounded-lg"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingPriceId(null)}
                                  className="px-2.5 py-1 bg-neutral-100 text-neutral-600 font-black text-[9px] uppercase tracking-wider rounded-lg"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setEditingPriceId(p._id); setTempPriceVal(p.price.toString()); }}
                                className="px-3.5 py-1.5 border border-[#F0EEEB] hover:border-[#D03D56]/50 text-neutral-700 hover:text-neutral-950 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer bg-white"
                              >
                                Edit Price
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CAMPAIGNS */}
          {activeTab === "campaigns" && (
            <div className="space-y-8 animate-fade-up">
              
              {/* Top stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Shares", val: 0 },
                  { label: "Active coupons", val: 0 },
                  { label: "Redemptions", val: 0 }
                ].map((s, idx) => (
                  <div key={idx} className="bg-white border border-[#F0EEEB] p-6 rounded-3xl shadow-sm">
                    <span className="text-[9px] text-[#737373] uppercase tracking-widest font-black block">{s.label}</span>
                    <span className="text-2xl font-black block text-neutral-955 mt-1.5">{s.val}</span>
                  </div>
                ))}
              </div>

              {/* Toggles bar */}
              <div className="bg-white border border-[#F0EEEB] p-1.5 rounded-2xl flex gap-1 max-w-sm">
                <button 
                  onClick={() => setCampaignType("campaigns")}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    campaignType === "campaigns" ? "bg-[#D03D56] text-white" : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Campaigns
                </button>
                <button 
                  onClick={() => setCampaignType("promo")}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    campaignType === "promo" ? "bg-[#D03D56] text-white" : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  Promo Codes
                </button>
              </div>

              {/* Search Bar + Create Button */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="Search campaigns..."
                    value={campaignSearchQuery}
                    onChange={e => setCampaignSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#F0EEEB] pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 transition-all font-semibold"
                  />
                </div>
                <button 
                  onClick={() => alert("Creating a new coupon or campaign template...")}
                  className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm transition-all cursor-pointer flex items-center gap-1"
                >
                  + New
                </button>
              </div>

              {/* Empty state & templates */}
              <div className="space-y-6">
                
                {/* Empty State Card */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl py-14 px-6 text-center space-y-4 shadow-sm">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide">No campaigns yet</h4>
                    <p className="text-[#737373] text-[9px] font-bold uppercase tracking-widest">Start from a template or build your own</p>
                  </div>
                </div>

                {/* Templates Grid */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#737373]">Recommended Templates</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Weekend Sale", body: "Hey! 🌟 Our weekend sale is LIVE. Grab your favourites at the best prices — only till Sunday! Tap to view catalog." },
                      { title: "New Arrivals", body: "Fresh stock just landed! ✨ Take a look at what's new this week. Tap the link to order on WhatsApp." }
                    ].map((t, idx) => (
                      <div key={idx} className="bg-white border border-[#F0EEEB] p-5 rounded-2xl space-y-3 hover:border-[#D03D56]/30 transition-all shadow-sm">
                        <h5 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {t.title}
                        </h5>
                        <p className="text-[10px] text-neutral-500 font-bold leading-relaxed">{t.body}</p>
                        <button 
                          onClick={() => alert(`Activated template: ${t.title}`)}
                          className="text-[9px] font-black text-[#D03D56] hover:underline uppercase tracking-widest block"
                        >
                          Use Template →
                        </button>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 6: SETTINGS (SUB-TABBED CONFIG PANEL) */}
          {activeTab === "settings" && (
            <div className="bg-white border border-[#F0EEEB] rounded-3xl p-8 shadow-sm animate-fade-up grid grid-cols-1 gap-6 items-start">
              
              {/* Settings sub-navigation menu */}
              <div className="flex gap-2 flex-nowrap overflow-x-auto">
                {[
                  { id: "general", label: "General", icon: Settings },
                  { id: "billing", label: "Billing", icon: CreditCard },
                  { id: "payments", label: "Payments", icon: Wallet },
                  { id: "shipping", label: "Delivery", icon: Truck },
                  { id: "checkout", label: "Checkout", icon: BarChart2 },
                  { id: "banners", label: "Banners", icon: Image }
                ].map(sub => {
                  const Icon = sub.icon;
                  const isSelected = settingsSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSettingsSubTab(sub.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.08em] transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-[#D03D56] text-white shadow-sm" 
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 border border-[#F0EEEB]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Sub-navigation pane */}
              <div className="w-full space-y-6">
                
                {settingsSubTab === "general" && (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-7xl mx-auto pb-2">
                    {/* Header + CTA in one line */}
                    <div className="flex justify-between items-center border-b border-[#F0EEEB] pb-3">
                      <div>
                        <h3 className="text-base font-black text-neutral-955 uppercase">General</h3>
                        <p className="text-[11px] text-neutral-500 font-semibold mt-0.5">Core store configuration.</p>
                      </div>
                      <button
                        type="submit" disabled={updating}
                        className="py-2 px-5 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {updating ? "Saving..." : "Save Settings"}
                      </button>
                    </div>

                    {errorMsg && <div className="p-2.5 bg-red-50 border border-red-100 text-red-707 text-xs rounded-xl font-bold">{errorMsg}</div>}
                    {successMsg && <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-707 text-xs rounded-xl font-bold">{successMsg}</div>}

                    {/* 3-Column Compact Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                      
                      {/* Column 1: Store identity */}
                      <div className="rounded-2xl border border-[#F0EEEB] bg-white p-4 space-y-3.5 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700">Store identity</h4>
                        
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Store name</label>
                            <input
                              required type="text"
                              className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                              value={name} onChange={e => setName(e.target.value)}
                            />
                            <span className="text-[8px] text-[#737373] font-bold block mt-0.5 leading-snug">
                              Your store URL stays the same even if you rename your store, so customer links keep working.
                            </span>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Owner name</label>
                            <input
                              type="text"
                              className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                              value={ownerName} onChange={e => setOwnerName(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Store category</label>
                            <div className="relative">
                              <select 
                                value={softwareType}
                                onChange={e => setSoftwareType(e.target.value)}
                                className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/50 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                              >
                                <optgroup label="Retail & Grocery">
                                  <option value="grocery">Grocery & Kirana</option>
                                  <option value="retail">General Retail Shop</option>
                                  <option value="pharmacy">Pharmacy / Medical Store</option>
                                  <option value="electronics">Electronics Store</option>
                                  <option value="clothing">Clothing & Apparel</option>
                                  <option value="stationery">Stationery & Books</option>
                                </optgroup>
                                <optgroup label="Food & Beverage">
                                  <option value="restaurant">Restaurant</option>
                                  <option value="bakery">Bakery</option>
                                  <option value="restaurant_bakery">Restaurant & Bakery</option>
                                  <option value="cafe">Café</option>
                                  <option value="fastfood">Fast Food / Street Food</option>
                                  <option value="juice_bar">Juice Bar / Smoothies</option>
                                  <option value="sweets_shop">Sweets & Mithai Shop</option>
                                  <option value="ice_cream">Ice Cream Parlour</option>
                                </optgroup>
                                <optgroup label="Services">
                                  <option value="salon">Salon & Spa</option>
                                  <option value="gym">Gym & Fitness</option>
                                  <option value="water">Water Delivery</option>
                                  <option value="workshop">Workshop / Classes</option>
                                  <option value="repair">Repair Services</option>
                                </optgroup>
                                <optgroup label="Other">
                                  <option value="other">Other</option>
                                </optgroup>
                              </select>
                              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[7px] font-bold text-neutral-450">
                                ▼
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Store Logo</label>
                              <input
                                type="file"
                                id="store-logo-picker"
                                accept="image/*"
                                onChange={handleLogoFileChange}
                                className="hidden"
                              />
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={() => document.getElementById('store-logo-picker').click()}
                                  className="w-10 h-10 bg-neutral-50 border border-dashed border-[#F0EEEB] hover:border-[#D03D56]/40 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-all"
                                >
                                  {logoUrl ? (
                                    <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                                  ) : (
                                    <Camera className="w-4 h-4 text-neutral-350" />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => document.getElementById('store-logo-picker').click()}
                                  className="px-2 py-1.5 border border-[#F0EEEB] hover:border-[#D03D56]/50 rounded-lg text-[8px] font-black uppercase tracking-wider bg-white cursor-pointer transition-all"
                                >
                                  Upload
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Favicon URL</label>
                              <input
                                type="text"
                                className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold font-mono"
                                value={faviconUrl} onChange={e => setFaviconUrl(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1.5 ml-0.5">Store status</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                type="button"
                                onClick={() => { setIsLive(true); setIsTestingMode(false); }}
                                className={`rounded-xl border py-2 text-center transition-all cursor-pointer ${
                                  isLive && !isTestingMode
                                    ? "border-[#D03D56] bg-[#D03D56] text-white shadow-sm font-black"
                                    : "border-[#F0EEEB] bg-white text-neutral-600 font-bold hover:border-[#D03D56]/40"
                                }`}
                              >
                                <div className="text-[9px] uppercase tracking-wider">Open</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => { setIsLive(false); setIsTestingMode(false); }}
                                className={`rounded-xl border py-2 text-center transition-all cursor-pointer ${
                                  !isLive && !isTestingMode
                                    ? "border-[#D03D56] bg-[#D03D56] text-white shadow-sm font-black"
                                    : "border-[#F0EEEB] bg-white text-neutral-600 font-bold hover:border-[#D03D56]/40"
                                }`}
                              >
                                <div className="text-[9px] uppercase tracking-wider">Closed</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => { setIsTestingMode(true); }}
                                className={`rounded-xl border py-2 text-center transition-all cursor-pointer ${
                                  isTestingMode
                                    ? "border-[#D03D56] bg-[#D03D56] text-white shadow-sm font-black"
                                    : "border-[#F0EEEB] bg-white text-neutral-600 font-bold hover:border-[#D03D56]/40"
                                }`}
                              >
                                <div className="text-[9px] uppercase tracking-wider">Testing</div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Contact info & Localization */}
                      <div className="space-y-4">
                        
                        {/* Contact Info */}
                        <div className="rounded-2xl border border-[#F0EEEB] bg-white p-4 space-y-3 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700">Contact info</h4>
                          
                          <div className="space-y-2.5 text-xs">
                            <div>
                              <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Store email</label>
                              <input
                                type="email"
                                className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                                value={email} onChange={e => setEmail(e.target.value)}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Add store phone</label>
                                <input
                                  type="tel"
                                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                                  value={phone} onChange={e => setPhone(e.target.value)}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">WhatsApp number</label>
                                <input
                                  type="tel"
                                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold"
                                  value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-[#737373] uppercase tracking-[0.2em] mb-1 ml-0.5">Address</label>
                              <textarea
                                rows={2}
                                className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-semibold resize-none"
                                value={address} onChange={e => setAddress(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Localization */}
                        <div className="rounded-2xl border border-[#F0EEEB] bg-white p-4 space-y-3 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700">Localization</h4>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-wider mb-1 ml-0.5">Select currency</label>
                              <div className="relative">
                                <select
                                  value={currency}
                                  onChange={e => setCurrency(e.target.value)}
                                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-2 py-2 text-[10px] rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                                >
                                  <option value="India — ₹ INR">India — ₹ INR</option>
                                  <option value="US — $ USD">US — $ USD</option>
                                  <option value="UK — £ GBP">UK — £ GBP</option>
                                  <option value="Europe — € EUR">Europe — € EUR</option>
                                  <option value="UAE — د.إ AED">UAE — د.إ AED</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-wider mb-1 ml-0.5">Timezone</label>
                              <div className="relative">
                                <select
                                  value={timezone}
                                  onChange={e => setTimezone(e.target.value)}
                                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-2 py-2 text-[10px] rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                                >
                                  <option value="India (IST)">India (IST)</option>
                                  <option value="GMT">GMT</option>
                                  <option value="EST">EST</option>
                                  <option value="PST">PST</option>
                                  <option value="GST">GST</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-wider mb-1 ml-0.5">Language</label>
                              <div className="relative">
                                <select
                                  value={language}
                                  onChange={e => setLanguage(e.target.value)}
                                  className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-2 py-2 text-[10px] rounded-lg focus:outline-none focus:border-[#D03D56]/40 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                                >
                                  <option value="English">English</option>
                                  <option value="Hindi">Hindi</option>
                                  <option value="Spanish">Spanish</option>
                                  <option value="French">French</option>
                                  <option value="Arabic">Arabic</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Domain & Ownership, New order alerts, Danger zone */}
                      <div className="space-y-4">
                        
                        {/* Domain & Ownership */}
                        <div className="rounded-2xl border border-[#F0EEEB] bg-white p-4 space-y-3.5 shadow-sm">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700">Domain</h4>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 border-l border-neutral-200 pl-3">Ownership</h4>
                          </div>
                          
                          <div className="space-y-3 text-xs">
                            <div>
                              <label className="block text-[9px] font-black text-[#737373] uppercase tracking-wider mb-1 ml-0.5">Store URL</label>
                              <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] border border-[#F0EEEB]">
                                <span className="font-mono text-[9px] font-bold text-neutral-800 truncate max-w-[140px]" title={`towncart-co-in.lovable.app/store/${slug}`}>
                                  towncart-co-in.lovable.app/store/{slug}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`towncart-co-in.lovable.app/store/${slug}`);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 1500);
                                  }}
                                  className="rounded border border-[#F0EEEB] bg-white px-2 py-1 text-[8px] font-black uppercase tracking-widest text-[#D03D56] hover:bg-[#F7EBEF] cursor-pointer"
                                >
                                  {copied ? "Copied" : "Copy"}
                                </button>
                              </div>
                            </div>

                            <div className="border-t border-[#F5F5F0] pt-2 flex items-center justify-between">
                              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Transfer ownership</span>
                              <button
                                type="button"
                                onClick={handleTransferOwnership}
                                className="px-3 py-1.5 border border-[#F0EEEB] bg-white rounded-lg text-[8px] font-black uppercase tracking-widest text-[#D03D56] hover:bg-[#F7EBEF] cursor-pointer"
                              >
                                Change Owner
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* New Order Alerts */}
                        <div className="rounded-2xl border border-[#F0EEEB] bg-white p-4 space-y-3.5 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 font-black">New order alerts</h4>
                          <p className="text-[9px] text-[#737373] font-semibold leading-normal">Instantly notify you when a new order arrives. Alert repeats every 10 seconds until acknowledged.</p>
                          
                          <div className="space-y-2 text-xs">
                            <label className="flex items-center justify-between rounded-xl border border-[#F0EEEB] bg-[#FAFAFA] px-3 py-2 cursor-pointer">
                              <div>
                                <div className="text-[9px] font-black uppercase tracking-wider text-neutral-700">Sound (siren)</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={soundAlertsEnabled}
                                onChange={e => setSoundAlertsEnabled(e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-[#D03D56] cursor-pointer"
                              />
                            </label>
                            
                            <label className="flex items-center justify-between rounded-xl border border-[#F0EEEB] bg-[#FAFAFA] px-3 py-2 cursor-pointer">
                              <div>
                                <div className="text-[9px] font-black uppercase tracking-wider text-neutral-700">Vibration</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={vibrationAlertsEnabled}
                                onChange={e => setVibrationAlertsEnabled(e.target.checked)}
                                className="w-3.5 h-3.5 rounded text-[#D03D56] cursor-pointer"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={handleTestAlert}
                              className="w-full rounded-lg bg-neutral-50 border border-[#F0EEEB] py-1.5 text-[9px] font-black uppercase tracking-widest text-neutral-905 hover:bg-[#F0EEEB] cursor-pointer"
                            >
                              Test alert
                            </button>
                          </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 space-y-2">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700">Danger zone</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-[8px] text-red-650/80 font-bold uppercase tracking-wider">Permanently delete your store.</p>
                            <button
                              type="button"
                              onClick={handleDeleteStore}
                              className="py-1.5 px-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-wider rounded-lg cursor-pointer"
                            >
                              Delete Store
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </form>
                )}

                {settingsSubTab === "billing" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-neutral-955 uppercase">Billing Settings</h3>
                      <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest mt-0.5">Manage subscription cycles.</p>
                    </div>
                    <div className="h-px bg-[#F5F5F0]" />
                    <div className="bg-[#FAFAFA] border border-[#F0EEEB] p-6 rounded-2xl space-y-2">
                      <span className="text-[9px] text-[#737373] uppercase tracking-widest font-black block">Active Plan Tier</span>
                      <p className="text-xs font-black text-neutral-900 capitalize">{subscriptionPlan} Plan</p>
                      <button 
                        onClick={() => alert("Redirecting to Stripe billing portal...")}
                        className="text-[9px] font-black text-[#D03D56] hover:underline uppercase tracking-widest block pt-2"
                      >
                        Modify Plan Tier →
                      </button>
                    </div>
                  </div>
                )}

                {settingsSubTab === "payments" && (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-neutral-955 uppercase">Payment Integrations</h3>
                      <p className="text-[10px] text-neutral-455 font-bold uppercase tracking-widest mt-0.5">Configure active gateway parameters.</p>
                    </div>
                    <div className="h-px bg-[#F5F5F0]" />
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={codEnabled}
                          onChange={e => setCodEnabled(e.target.checked)}
                          className="w-4 h-4 rounded text-[#D03D56]" 
                        />
                        <span className="text-xs font-bold text-neutral-850">Enable Cash on Delivery (COD)</span>
                      </label>
                      
                      <div>
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">UPI ID (Google Pay / PhonePe)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. storename@upi"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40"
                        />
                      </div>
                    </div>
                    <button
                      type="submit" disabled={updating}
                      className="py-3 px-6 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                    >
                      {updating ? "Saving..." : "Save Settings"}
                    </button>
                  </form>
                )}

                {settingsSubTab === "shipping" && (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-neutral-955 uppercase">Delivery & Logistics</h3>
                      <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest mt-0.5">Set fees and pickup parameters.</p>
                    </div>
                    <div className="h-px bg-[#F5F5F0]" />
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Flat Delivery Fee (INR)</label>
                        <input 
                          type="number" 
                          value={deliveryFee}
                          onChange={e => setDeliveryFee(parseInt(e.target.value) || 0)}
                          className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selfPickup}
                          onChange={e => setSelfPickup(e.target.checked)}
                          className="w-4 h-4 rounded text-[#D03D56]" 
                        />
                        <span className="text-xs font-bold text-neutral-850">Allow Store Self-Pickup</span>
                      </label>
                    </div>
                    <button
                      type="submit" disabled={updating}
                      className="py-3 px-6 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm"
                    >
                      {updating ? "Saving..." : "Save Settings"}
                    </button>
                  </form>
                )}

                {settingsSubTab === "checkout" && (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-neutral-955 uppercase font-manrope">Checkout Channel Settings</h3>
                      <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest mt-0.5">Control where customers place their orders.</p>
                    </div>
                    <div className="h-px bg-neutral-100" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button type="button" onClick={() => setCheckoutMode("website")}
                        className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[120px] cursor-pointer ${
                          checkoutMode === "website" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white"
                        }`}>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-neutral-900">Standard Website Checkout</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutMode === "website" ? "bg-neutral-900 border-neutral-900" : "border-neutral-300"}`}>
                            {checkoutMode === "website" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-450 mt-3 leading-relaxed">
                          Customers complete orders directly on your storefront site, logging UTR reference or cash parameters.
                        </p>
                      </button>

                      <button type="button" onClick={() => setCheckoutMode("whatsapp")}
                        className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[120px] cursor-pointer ${
                          checkoutMode === "whatsapp" ? "border-emerald-600 bg-emerald-50/15" : "border-neutral-200 bg-white"
                        }`}>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4" /> WhatsApp Redirect Checkout
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${checkoutMode === "whatsapp" ? "bg-emerald-600 border-emerald-600" : "border-neutral-300"}`}>
                            {checkoutMode === "whatsapp" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-455 mt-3 leading-relaxed">
                          Orders automatically redirect to WhatsApp, packaging items list, map links, and payment options into formatted messages.
                        </p>
                      </button>
                    </div>

                    {/* ── WHATSAPP NUMBER MISSING WARNING ── */}
                    {checkoutMode === "whatsapp" && !whatsappNumber.replace(/[^0-9]/g, "") && (
                      <div className="border border-amber-300 bg-amber-50 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-800">⚠️ WhatsApp number missing</p>
                          <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                            You have selected WhatsApp checkout but your WhatsApp number is not set. Customers will not be able to complete orders until you add your number.
                          </p>
                          <button
                            type="button"
                            onClick={() => setSettingsSubTab("general")}
                            className="mt-2 text-[10px] font-black text-amber-800 underline underline-offset-2 cursor-pointer hover:text-amber-900"
                          >
                            → Go to General Settings to add your WhatsApp number
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit" disabled={updating}
                      className="py-3 px-6 bg-[#D03D56] hover:bg-[#a02240] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      {updating ? "Saving..." : "Save Settings"}
                    </button>
                  </form>
                )}

                {settingsSubTab === "banners" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-neutral-955 uppercase">Promo Banners</h3>
                      <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-widest mt-0.5">Set storefront promotional strips.</p>
                    </div>
                    <div className="h-px bg-[#F5F5F0]" />
                    <button 
                      onClick={() => alert("Upload promo banner media assets...")}
                      className="px-4 py-2.5 border border-[#F0EEEB] hover:border-[#D03D56]/50 rounded-xl text-xs font-black uppercase tracking-widest bg-white"
                    >
                      + Add New Banner
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB: BALANCE */}
          {activeTab === "balance" && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-2xl font-black text-neutral-950 uppercase font-manrope">
                  Balance &amp; Payouts
                </h1>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
                  Track your earnings, withdrawals, and bank account details
                </p>
              </div>

              {/* Balance Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#111111] rounded-3xl p-6 text-white shadow-lg col-span-1 sm:col-span-1 flex flex-col justify-between min-h-[140px]">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Available Balance</span>
                    <p className="text-3xl font-black mt-1 font-numbers">₹{(salesTotal * 0.82).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <span className="text-[9px] font-medium opacity-50 block mt-1">After 18% platform commission</span>
                  </div>
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="mt-4 px-5 py-2.5 bg-white text-neutral-900 hover:bg-neutral-100 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm text-center"
                  >
                    Withdraw Funds
                  </button>
                </div>

                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Total Earned</span>
                    <p className="text-2xl font-black text-neutral-900 mt-1 font-numbers">₹{(salesTotal || 0).toLocaleString('en-IN')}</p>
                    <span className="text-[9px] text-neutral-450 font-bold block mt-1">Gross revenue all time</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Revenue growing</span>
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Pending Clearance</span>
                    <p className="text-2xl font-black text-neutral-900 mt-1 font-numbers">
                      ₹{(ordersList.filter(o => o.status === "pending" || o.status === "preparing")
                          .reduce((sum, o) => sum + (o.totalAmount || 0), 0) * 0.82)
                          .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <span className="text-[9px] text-neutral-455 font-bold block mt-1">From {ordersList.filter(o => o.status === "pending" || o.status === "preparing").length} active orders</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Awaiting settlement</span>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 font-manrope">Transaction History</h3>
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Recent order payment logs</p>
                  </div>
                  <button 
                    onClick={handleExportOrders}
                    className="px-4 py-2 border border-neutral-200 hover:border-neutral-350 rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-700 cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>
                <div className="h-px bg-neutral-100" />

                {ordersList.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 text-xs">No transactions recorded yet.</div>
                ) : (
                  <div className="space-y-2.5">
                    {ordersList.slice(0, 15).map(order => (
                      <div key={order._id} className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-neutral-200 rounded-2xl hover:border-neutral-350 transition-all">
                        <div className="min-w-0">
                          <span className="text-xs font-black text-neutral-900 block truncate">{order.customerName}</span>
                          <span className="text-[9px] text-neutral-400 font-bold block mt-0.5 font-numbers">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            order.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                            order.status === "preparing" ? "bg-blue-50 text-blue-700 border-blue-250" :
                            order.status === "cancelled" ? "bg-red-50 text-red-700 border-red-250" :
                            "bg-amber-50 text-amber-700 border-amber-250"
                          }`}>{order.status}</span>
                          <div className="text-right">
                            <span className="text-xs font-black text-neutral-900 block font-numbers">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</span>
                            <span className="text-[9px] text-emerald-600 font-black block font-numbers">
                              +₹{((order.totalAmount || 0) * 0.82).toLocaleString('en-IN', { maximumFractionDigits: 0 })} net
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payout History */}
              {withdrawalRequests.length > 0 && (
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-neutral-955">Payout Requests</h3>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Recent withdrawal activity</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {withdrawalRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between rounded-2xl border border-[#F0EEEB] bg-[#FAFAFA] px-4 py-3">
                        <div>
                          <p className="text-[10px] font-black text-neutral-900">₹{Number(request.amount || 0).toLocaleString("en-IN")}</p>
                          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{request.bankName || "Primary bank"} · {request.accountHolder}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-amber-700 border border-amber-200">
                            {request.status}
                          </span>
                          <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
                            {new Date(request.requestedAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Account Details */}
              <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-955">Bank Account Details</h3>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Where your payouts are deposited</p>
                </div>
                <div className="h-px bg-[#F5F5F0]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Account Holder Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Taste N Park Pvt Ltd"
                      value={bankAccountHolder}
                      onChange={(e) => setBankAccountHolder(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Bank Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HDFC Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Account Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 1234567890"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">IFSC Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HDFC0001234"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">UPI ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. storename@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-bold"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSaveBankDetails}
                  disabled={updating}
                  className="px-6 py-3 bg-[#D03D56] hover:bg-[#a02240] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {updating ? "Saving Details..." : "Save Bank Details"}
                </button>
              </div>

              {/* Withdrawal Confirmation Modal */}
              {showWithdrawModal && (
                <div
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  <div
                    className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5 animate-fade-up"
                    onClick={e => e.stopPropagation()}
                  >
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">Request Withdrawal</h3>
                      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
                        ₹{(salesTotal * 0.82).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available for payout
                      </p>
                    </div>
                    <div className="h-px bg-[#F0EEEB]" />
                    {bankAccountHolder ? (
                      <div className="space-y-3">
                        <div className="bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl p-4 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Account Holder</span>
                            <span className="text-[9px] font-black text-neutral-900">{bankAccountHolder}</span>
                          </div>
                          {bankName && (
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Bank</span>
                              <span className="text-[9px] font-black text-neutral-900">{bankName}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Account</span>
                            <span className="text-[9px] font-black text-neutral-900">••••{bankAccountNumber.slice(-4) || "••••"}</span>
                          </div>
                          {bankIfsc && (
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">IFSC</span>
                              <span className="text-[9px] font-black text-neutral-900">{bankIfsc}</span>
                            </div>
                          )}
                          {upiId && (
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">UPI</span>
                              <span className="text-[9px] font-black text-neutral-900">{upiId}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                          Funds credited within 2–3 business days. 18% platform commission already deducted.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowWithdrawModal(false)}
                            className="flex-1 px-4 py-3 border border-[#F0EEEB] text-neutral-700 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-neutral-50 cursor-pointer transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRequestWithdrawal}
                            className="flex-1 px-4 py-3 bg-[#D03D56] text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-[#a02240] cursor-pointer transition-all shadow-sm"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 py-2">
                        <p className="text-xs text-neutral-500 font-bold">No bank details found.</p>
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Please fill in your bank account details below before requesting a withdrawal.</p>
                        <button
                          onClick={() => setShowWithdrawModal(false)}
                          className="px-6 py-3 bg-[#D03D56] text-white font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer hover:bg-[#a02240] transition-all"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-2xl font-black text-neutral-955 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Operational Analytics
                </h1>
                <p className="text-xs text-neutral-450 font-bold uppercase tracking-widest mt-0.5">
                  Gross revenue, tickets, and pipeline statistics
                </p>
              </div>

              {/* Analytics KPI Tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Gross Generated Revenue", value: `₹${(salesTotal || 0).toLocaleString('en-IN')}`, icon: BarChart2, color: "text-[#D03D56]", bg: "bg-[#F7EBEF]" },
                  { label: "Order Transaction Logs", value: `${ordersList.length} Logged`, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Catalog Listings", value: `${productsCount} Products`, icon: Package, color: "text-purple-500", bg: "bg-purple-50" },
                  { label: "Incoming Active Queue", value: `${ordersList.filter(o => ['pending', 'preparing'].includes(o.status)).length} Tickets`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black text-[#737373] uppercase tracking-widest block">{label}</span>
                      <span className="text-xl font-black text-neutral-900 mt-1 block">{value}</span>
                    </div>
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${color}`} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Status distribution */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm lg:col-span-1 space-y-5">
                  <h3 className="font-black text-xs uppercase tracking-widest text-[#737373]">
                    Pipeline Segments
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Completed Operations", count: ordersList.filter(o => o.status === 'completed').length, color: "bg-emerald-500" },
                      { label: "Active Preparation", count: ordersList.filter(o => o.status === 'preparing').length, color: "bg-orange-500" },
                      { label: "Pending Verification", count: ordersList.filter(o => o.status === 'pending').length, color: "bg-amber-500" },
                      { label: "Cancelled Tickets", count: ordersList.filter(o => o.status === 'cancelled').length, color: "bg-red-500" },
                    ].map(({ label, count, color }) => (
                      <div key={label} className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#F0EEEB]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-neutral-700 uppercase tracking-wider">{label}</span>
                          <span className="text-xs font-black text-neutral-900 bg-white px-2 py-0.5 border border-[#F0EEEB] rounded-lg shadow-sm">{count}</span>
                        </div>
                        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${color} rounded-full transition-all duration-500`}
                            style={{ width: ordersList.length ? `${(count / ordersList.length) * 100}%` : "0%" }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operations live redirects */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-5">
                  <h3 className="font-black text-xs uppercase tracking-widest text-[#737373]">
                    Ledger Auditing & Live Logs
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={`/${slug}/kitchen`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center text-center p-5 border border-amber-200 bg-amber-50 hover:bg-amber-100/50 rounded-2xl transition-all gap-2"
                    >
                      <span className="text-[10px] font-black text-amber-855 uppercase tracking-widest">Kitchen Live KDS</span>
                      <span className="text-[9px] font-bold text-amber-700">Open kitchen ticket feed →</span>
                    </a>
                    <a
                      href={`/${slug}/delivery`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center text-center p-5 border border-blue-200 bg-blue-50 hover:bg-blue-100/50 rounded-2xl transition-all gap-2"
                    >
                      <span className="text-[10px] font-black text-blue-855 uppercase tracking-widest">Courier Dispatch Feed</span>
                      <span className="text-[9px] font-bold text-blue-700">Open delivery dispatch log →</span>
                    </a>
                  </div>

                  <div className="h-px bg-[#F5F5F0]" />

                  {ordersList.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400 text-xs">
                      No logged operations transactions found.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {ordersList.slice(0, 5).map(o => (
                        <div key={o._id} className="flex justify-between items-center p-3 bg-[#FAFAFA] border border-[#F0EEEB] rounded-xl text-xs">
                          <div>
                            <span className="font-black text-neutral-900 block">{o.customerName}</span>
                            <span className="text-[9px] text-[#737373] font-bold uppercase tracking-wider block mt-0.5">
                              {o.items?.length || 0} items · {new Date(o.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-[#D03D56] block">₹{o.totalAmount}</span>
                            <span className="text-[8px] font-black uppercase text-neutral-500 tracking-wider block mt-0.5">{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* TAB 8: STAFF */}
          {activeTab === "staff" && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-2xl font-black text-neutral-955 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Staff Profiles & Access Control
                </h1>
                <p className="text-xs text-neutral-450 font-bold uppercase tracking-widest mt-0.5">
                  Authorize employees and manage terminal dispatcher roles
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Register Staff Form */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm lg:col-span-1 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-950">Add Staff Member</h3>
                    <p className="text-[9px] text-[#737373] uppercase font-black tracking-widest">Register dispatcher role</p>
                  </div>
                  <div className="h-px bg-[#F5F5F0]" />

                  {staffError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-[10px] font-bold">
                      {staffError}
                    </div>
                  )}
                  {staffSuccess && (
                    <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-200 text-[10px] font-bold">
                      {staffSuccess}
                    </div>
                  )}

                  <form onSubmit={handleAddStaff} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Employee Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Shyam Sundar"
                        value={staffForm.name}
                        onChange={e => setStaffForm({...staffForm, name: e.target.value})}
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Staff Role</label>
                      <select
                        required
                        value={staffForm.role}
                        onChange={e => setStaffForm({...staffForm, role: e.target.value})}
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                      >
                        <option value="">Select Role...</option>
                        {["Store Manager", "Retail Associate", "Sous Chef", "Chef KDS Dispatcher", "Logistics Driver", "Delivery Courier"].map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="e.g. shyam@store.com"
                        value={staffForm.email}
                        onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. 9876543210"
                        value={staffForm.phone}
                        onChange={e => setStaffForm({...staffForm, phone: e.target.value})}
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={staffLoading}
                      className="w-full py-3 bg-[#D03D56] hover:bg-[#3F0712] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {staffLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>Add Staff Member</span>
                    </button>
                  </form>
                </div>

                {/* Staff list */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-955">Active Roster List</h3>
                    <span className="px-2.5 py-0.5 bg-neutral-50 text-neutral-600 border border-[#F0EEEB] rounded-full text-[9px] font-black uppercase tracking-wider">
                      {staffList.length} members
                    </span>
                  </div>
                  <div className="h-px bg-[#F5F5F0]" />

                  {staffLoading && staffList.length === 0 ? (
                    <div className="text-center py-20 text-[#737373] animate-pulse text-xs">
                      Fetching employees profiles...
                    </div>
                  ) : staffList.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400 text-xs">
                      No active staff profiles found.
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {staffList.map(emp => (
                        <div key={emp._id} className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-[#F0EEEB] rounded-2xl hover:border-neutral-250 transition-all">
                          <div className="min-w-0">
                            <span className="font-black text-xs text-neutral-955 block">{emp.name}</span>
                            <span className="text-[9px] font-black text-[#D03D56] uppercase tracking-wider block mt-0.5">
                              {emp.role}
                            </span>
                            <span className="text-[9px] text-[#737373] font-bold block mt-1">
                              {emp.email} · {emp.phone}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteStaff(emp._id)}
                            className="p-2 border border-red-150 hover:border-red-300 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 9: ADD PRODUCT */}
          {location.pathname === "/products/new" && (
            <div className="space-y-6 animate-fade-up max-w-4xl mx-auto pb-10">
              
              {/* Top back header */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="p-2.5 border border-[#F0EEEB] hover:border-neutral-350 rounded-xl bg-white text-neutral-800 cursor-pointer transition-all font-black text-xs"
                >
                  ← Back to Dashboard
                </button>
                <div>
                  <h1 className="text-xl font-black text-neutral-955 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Add Product
                  </h1>
                </div>
              </div>

              <form onSubmit={handleAddNewProductSubmit} className="space-y-6">
                
                {/* Image Picker */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
                  <input 
                    type="file" 
                    id="new-product-file-picker" 
                    accept="image/*" 
                    onChange={handleImageFileChange} 
                    className="hidden" 
                  />
                  <div 
                    onClick={() => document.getElementById('new-product-file-picker').click()}
                    className="w-40 h-28 border-2 border-dashed border-[#F0EEEB] hover:border-[#D03D56]/40 bg-[#FAFAFA] rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all gap-1.5 overflow-hidden"
                  >
                    {newProdImage ? (
                      <img src={newProdImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <Image className="w-6 h-6 text-neutral-400" />
                        <span className="text-[9px] font-black uppercase text-[#737373] tracking-widest">Tap to add image</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-3 items-center text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        const url = window.prompt("Enter image URL:");
                        if (url) setNewProdImage(url);
                      }}
                      className="font-black text-[#D03D56] hover:underline uppercase tracking-wider cursor-pointer"
                    >
                      Or Paste Image URL
                    </button>
                    {newProdImage && (
                      <>
                        <span className="text-neutral-300">|</span>
                        <button
                          type="button"
                          onClick={() => setNewProdImage("")}
                          className="font-black text-red-650 hover:underline uppercase tracking-wider cursor-pointer"
                        >
                          Remove Image
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Core Pricing & Variant Attributes Card */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm space-y-5">
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Product Name *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Fresh Tomatoes"
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-[#D03D56]/40 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Price (₹) *</label>
                      <input 
                        required
                        type="number" 
                        placeholder="0"
                        value={newProdPrice}
                        onChange={e => setNewProdPrice(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Discounted Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="Optional, must be less than Price"
                        value={newProdDiscountPrice}
                        onChange={e => setNewProdDiscountPrice(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* Variants Section */}
                  <div className="border border-[#F0EEEB] p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Variants (size + price)</h4>
                        <p className="text-[8px] text-[#737373] font-bold uppercase tracking-wider">Tip: type 2, 3 and press KG to add multiple items at once.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewProdVariants([...newProdVariants, { variantLabel: "", price: newProdPrice || 0, stock: 100, unit: "KG", sku: "" }])}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-[#F0EEEB] rounded-lg text-[9px] font-black uppercase text-neutral-700 tracking-wider cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                      <input 
                        type="text" 
                        placeholder="Select units: e.g. 2, 3"
                        value={variantInputText}
                        onChange={e => setVariantInputText(e.target.value)}
                        className="bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4.5 py-2 text-xs rounded-xl focus:outline-none flex-1 min-w-[150px] font-bold"
                      />
                      <select
                        value={variantInputUnit}
                        onChange={e => setVariantInputUnit(e.target.value)}
                        className="bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-3 py-2 text-xs rounded-xl focus:outline-none"
                      >
                        {["KG", "g", "L", "ml", "pcs", "pack"].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleQuickAddVariants}
                        className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer"
                      >
                        Add all
                      </button>
                    </div>

                    {/* Rendered variants list */}
                    {newProdVariants.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {newProdVariants.map((v, i) => (
                          <div key={i} className="flex gap-2 items-center flex-wrap bg-[#FAFAFA] border border-[#F0EEEB] p-3.5 rounded-xl">
                            <input 
                              type="text" 
                              placeholder="Label e.g. 500g"
                              value={v.variantLabel}
                              onChange={e => {
                                const copy = [...newProdVariants];
                                copy[i].variantLabel = e.target.value;
                                setNewProdVariants(copy);
                              }}
                              className="bg-white border border-[#F0EEEB] px-3 py-1.5 text-xs rounded-lg flex-1 min-w-[120px] font-bold"
                            />
                            <input 
                              type="number" 
                              placeholder="Price"
                              value={v.price}
                              onChange={e => {
                                const copy = [...newProdVariants];
                                copy[i].price = parseFloat(e.target.value) || 0;
                                setNewProdVariants(copy);
                              }}
                              className="bg-white border border-[#F0EEEB] px-3 py-1.5 text-xs rounded-lg w-20 font-bold"
                            />
                            <select
                              value={v.unit}
                              onChange={e => {
                                const copy = [...newProdVariants];
                                copy[i].unit = e.target.value;
                                setNewProdVariants(copy);
                              }}
                              className="bg-white border border-[#F0EEEB] px-2.5 py-1.5 text-xs rounded-lg"
                            >
                              {["KG", "g", "L", "ml", "pcs", "pack"].map(u => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setNewProdVariants(newProdVariants.filter((_, idx) => idx !== i))}
                              className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Pills list */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest">Category *</label>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableCategories().map(cat => {
                        const isSel = newProdCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewProdCategory(cat)}
                            className={`px-4.5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                              isSel 
                                ? "bg-[#D03D56] text-white border-[#D03D56]" 
                                : "bg-neutral-50 text-[#737373] border-[#F0EEEB] hover:bg-neutral-100"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Description</label>
                    <textarea 
                      placeholder="Optional description..."
                      rows="4"
                      value={newProdDescription}
                      onChange={e => setNewProdDescription(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Additional metadata metrics box */}
                <div className="bg-white border border-[#F0EEEB] rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Brand</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Brand X"
                      value={newProdBrand}
                      onChange={e => setNewProdBrand(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Tag</label>
                    <input 
                      type="text" 
                      placeholder="comma-separated"
                      value={newProdTags}
                      onChange={e => setNewProdTags(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Stock</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={newProdStock}
                      onChange={e => setNewProdStock(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Availability</label>
                    <select
                      value={newProdAvailability}
                      onChange={e => setNewProdAvailability(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none"
                    >
                      <option value="Show">Show</option>
                      <option value="Hide">Hide</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Weight</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500g"
                      value={newProdWeight}
                      onChange={e => setNewProdWeight(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Package Size</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Pack of 6"
                      value={newProdPackageSize}
                      onChange={e => setNewProdPackageSize(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-neutral-900 px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Flavor</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Vanilla"
                      value={newProdFlavor}
                      onChange={e => setNewProdFlavor(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-[#737373] px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Origin</label>
                    <input 
                      type="text" 
                      placeholder="e.g. India"
                      value={newProdOrigin}
                      onChange={e => setNewProdOrigin(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-[#737373] px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-black text-[#737373] uppercase tracking-widest mb-1.5">Dietary Info</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Vegan, Gluten-free"
                      value={newProdDietaryInfo}
                      onChange={e => setNewProdDietaryInfo(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#F0EEEB] text-[#737373] px-4 py-2.5 text-xs rounded-xl focus:outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Big full-width green submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add Product</span>
                </button>

              </form>

            </div>
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
