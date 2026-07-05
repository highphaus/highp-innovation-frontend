import React, { useState } from "react";
import { ActionHeader } from "@/components/ui/ActionHeader";
import { useOrders } from "@/lib/OrderContext";
import { useAuth } from "@/lib/AuthContext";
import { MapPin, Navigation, Package, CheckCircle2, Phone, DollarSign, Briefcase, History, TrendingUp, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalBox } from "@/components/ui/ModalBox";
import { useSimulatedNetworkDelay } from "@/lib/useSimulatedNetworkDelay";

export default function DriverDashboard() {
  const { orders, claimOrder, updateOrderStatus } = useOrders();
  const { activeTab, setActiveTab } = useAuth();
  const isLoading = useSimulatedNetworkDelay(1000);
  
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [modalData, setModalData] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    type: "info" 
  });
  
  const driverId = "DRV-1";
  
  // Jobs available to claim (ready for delivery)
  const availableJobs = orders.filter(o => o.status === "ready" && o.type === "delivery" && !o.driverId);
  // Jobs I am currently delivering
  const activeJobs = orders.filter(o => o.driverId === driverId && o.status === "delivering");
  // Completed jobs by me
  const completedJobs = orders.filter(o => o.driverId === driverId && o.status === "delivered");

  // Calculate earnings: $5.00 base delivery fee + 10% tip
  const getOrderEarnings = (total) => 5.00 + (total * 0.10);
  const totalEarnings = completedJobs.reduce((acc, job) => acc + getOrderEarnings(job.total), 0);

  const handleClaim = (orderId) => {
    claimOrder(orderId, driverId);
    setModalData({
      isOpen: true,
      title: "Job Claimed!",
      message: `You have claimed order ${orderId}. Please proceed to the store immediately.`,
      type: "success"
    });
    // Automatically redirect to Active tab
    setActiveTab("Active");
  };

  const handleComplete = (orderId) => {
    updateOrderStatus(orderId, "delivered");
    setModalData({
      isOpen: true,
      title: "Delivery Completed",
      message: `Order ${orderId} has been successfully completed. Your earnings have been updated!`,
      type: "success"
    });
    // Redirect to Earnings tab
    setActiveTab("Earnings");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 w-full max-w-7xl mx-auto">
      <ActionHeader 
        title="Delivery Partner" 
        className="bg-gray-900 text-white border-none" 
        rightAction={
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
            <button 
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isOnDuty ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <motion.div 
                className="w-4 h-4 bg-white rounded-full shadow-md"
                animate={{ x: isOnDuty ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        } 
      />

      <div className="p-4 flex flex-col gap-4">
        {!isOnDuty ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center mt-10 max-w-md mx-auto w-full">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 mb-2">You are Off Duty</h2>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
              Please toggle your status in the header to start claiming delivery tasks and tracking earnings.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* 1. JOBS TAB */}
            {activeTab === "Jobs" && (
              <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Available Tasks</h3>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {availableJobs.length} Nearby
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/5" />
                        </div>
                        <div className="h-8 bg-gray-100 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : availableJobs.length === 0 ? (
                  <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-8 text-center mt-2 flex flex-col items-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <Navigation className="w-6 h-6 text-gray-300 animate-pulse" />
                    </div>
                    <p className="text-gray-900 font-extrabold text-sm mb-0.5">Searching for Jobs...</p>
                    <p className="text-gray-400 text-xs">Waiting for KDS to prepare deliveries.</p>
                    <div className="flex justify-center mt-4 gap-1">
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i}
                          className="w-2 h-2 bg-orange-500 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <AnimatePresence>
                      {availableJobs.map((job) => (
                        <motion.div 
                          key={job.id} 
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Order ID</span>
                              <span className="font-black text-gray-900">{job.id}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Est. Payout</span>
                              <span className="font-black text-green-600">${getOrderEarnings(job.total).toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2.5 bg-gray-50 p-3 rounded-2xl border border-gray-200/50 text-xs text-gray-600 font-medium">
                            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{job.address}</span>
                          </div>
                          
                          <button 
                            onClick={() => handleClaim(job.id)}
                            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-extrabold h-12 rounded-2xl transition-all shadow-md shadow-orange-600/10 text-xs"
                          >
                            Accept & Navigate
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* 2. ACTIVE TAB */}
            {activeTab === "Active" && (
              <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 px-1">Route & Delivery</h3>
                
                {activeJobs.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-bold text-sm">No Active Jobs</p>
                    <p className="text-gray-400 text-xs mt-1 mb-4">Accept a pending task in the Jobs pool to start.</p>
                    <button 
                      onClick={() => setActiveTab("Jobs")}
                      className="bg-orange-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm"
                    >
                      Go to Jobs
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {activeJobs.map(job => (
                      <div key={job.id} className="flex flex-col gap-4">
                        {/* GPS Simulation Card */}
                        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                            GPS Simulator Active
                          </div>
                          
                          {/* Stylized SVG Map representation */}
                          <div className="w-full h-44 bg-blue-50 border border-blue-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                              {/* Grid lines */}
                              <defs>
                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" />
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid)" />
                              
                              {/* Dotted Delivery Route Path */}
                              <path 
                                id="route-path"
                                d="M 40,130 C 80,130 100,50 150,50 C 200,50 220,130 260,130 C 300,130 310,60 360,60" 
                                fill="none" 
                                stroke="#94a3b8" 
                                strokeWidth="3" 
                                strokeDasharray="6,6"
                              />

                              {/* Animation Path */}
                              <path 
                                d="M 40,130 C 80,130 100,50 150,50 C 200,50 220,130 260,130 C 300,130 310,60 360,60" 
                                fill="none" 
                                stroke="#f97316" 
                                strokeWidth="3"
                                strokeDasharray="300"
                                strokeDashoffset="300"
                                className="animate-[dash_8s_linear_infinite]"
                                style={{
                                  strokeDashoffset: 300,
                                  animation: 'dash 10s ease-in-out infinite'
                                }}
                              />
                              
                              {/* Keyframes style embedded */}
                              <style>{`
                                @keyframes dash {
                                  to {
                                    stroke-dashoffset: 0;
                                  }
                                }
                                @keyframes pulse {
                                  0%, 100% { transform: scale(1); opacity: 1; }
                                  50% { transform: scale(1.2); opacity: 0.8; }
                                }
                              `}</style>
                            </svg>

                            {/* Store Location Pin */}
                            <div className="absolute left-[30px] bottom-[30px] flex flex-col items-center">
                              <span className="bg-orange-600 text-white rounded-lg px-1.5 py-0.5 text-[8px] font-black shadow-sm mb-1">
                                Store
                              </span>
                              <div className="w-5 h-5 bg-orange-100 border border-orange-500 rounded-full flex items-center justify-center shadow-sm">
                                🏪
                              </div>
                            </div>

                            {/* Destination Pin */}
                            <div className="absolute right-[30px] top-[30px] flex flex-col items-center">
                              <span className="bg-rose-600 text-white rounded-lg px-1.5 py-0.5 text-[8px] font-black shadow-sm mb-1 animate-bounce">
                                Deliver
                              </span>
                              <div className="w-5 h-5 bg-rose-100 border border-rose-500 rounded-full flex items-center justify-center shadow-sm">
                                🏠
                              </div>
                            </div>
                            
                            {/* Moving Car simulation dot */}
                            <motion.div 
                              className="absolute w-3.5 h-3.5 bg-orange-600 border border-white rounded-full shadow-md z-10 flex items-center justify-center text-[7px]"
                              animate={{
                                x: [ -120, -60, 0, 60, 120, -120 ],
                                y: [ 45, -35, 45, -25, -25, 45 ]
                              }}
                              transition={{
                                duration: 10,
                                ease: "easeInOut",
                                repeat: Infinity
                              }}
                            >
                              🛵
                            </motion.div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-gray-800">Heading to Springfield</p>
                              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Estimated Remaining Time: 4 mins</p>
                            </div>
                            <button className="h-9 px-4 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all">
                              <Phone className="w-3.5 h-3.5 text-gray-500" /> Call
                            </button>
                          </div>
                        </div>

                        {/* Customer Information Card */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Active Task</span>
                              <span className="font-black text-gray-900">{job.id}</span>
                            </div>
                            <span className="bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-orange-100">
                              Transit
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-lg">👤</span>
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-gray-900">{job.customerName}</p>
                              <p className="text-xs text-gray-500 font-medium mt-0.5">{job.address}</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Package Items</p>
                            {job.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs font-bold text-gray-700 mb-1 last:mb-0">
                                <span>{item.quantity}x {item.name}</span>
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => handleComplete(job.id)}
                            className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-gray-900 font-black h-12 rounded-2xl transition-all shadow-md shadow-green-500/10 flex items-center justify-center gap-1.5 text-xs"
                          >
                            <CheckCircle2 className="w-4.5 h-4.5" /> Confirm Delivery Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. EARNINGS TAB */}
            {activeTab === "Earnings" && (
              <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 px-1">Earnings Overview</h3>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Earned</p>
                      <p className="text-xl font-black text-gray-900">${totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Completed</p>
                      <p className="text-xl font-black text-gray-900">{completedJobs.length} Jobs</p>
                    </div>
                  </div>
                </div>

                {/* Week chart simulation */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800">Weekly Performance</span>
                    <span className="text-[10px] text-gray-400 font-bold">Mon, Jun 29 - Sun, Jul 5</span>
                  </div>
                  
                  {/* Stylized Bar Chart */}
                  <div className="flex justify-around items-end h-28 pt-4 border-b border-gray-100">
                    {[
                      { day: "M", amt: 15, active: false },
                      { day: "T", amt: 22, active: false },
                      { day: "W", amt: 0, active: false },
                      { day: "T", amt: 35, active: false },
                      { day: "F", amt: 48, active: false },
                      { day: "S", amt: totalEarnings > 0 ? 30 : 0, active: true },
                      { day: "S", amt: 0, active: false }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-full max-w-[24px]">
                        <div className="w-full relative bg-gray-100 rounded-t-lg h-20 flex items-end">
                          <div 
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              bar.active ? "bg-orange-600" : "bg-orange-200"
                            }`} 
                            style={{ height: `${(bar.amt / 60) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    💡 Base delivery rewards are calculated at $5.00 per order, supplemented by a 10% customer gratuity.
                  </p>
                </div>

                {/* Deliveries Logs */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Job History</h4>
                  
                  {completedJobs.length === 0 ? (
                    <div className="text-center py-8 bg-white border border-gray-100 rounded-3xl p-6 text-gray-400">
                      <p className="font-bold text-xs">No Deliveries Logged</p>
                      <p className="text-[10px] mt-0.5">Your completed task history will populate here.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {completedJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
                          <div>
                            <span className="font-black text-gray-900 text-sm">{job.id}</span>
                            <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                              Customer: {job.customerName}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-green-600 text-sm block">
                              +${getOrderEarnings(job.total).toFixed(2)}
                            </span>
                            <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
                              Delivered
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModalBox 
        isOpen={modalData.isOpen} 
        onClose={() => setModalData({ ...modalData, isOpen: false })} 
        title={modalData.title} 
        message={modalData.message} 
        type={modalData.type} 
      />
    </div>
  );
}
