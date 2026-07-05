
import { useAuth } from "@/lib/AuthContext";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";
import DriverDashboard from "@/components/dashboards/DriverDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import StaffDashboard from "@/components/dashboards/StaffDashboard";

export default function Home() {
  const { role } = useAuth();

  return (
    <main className="flex-1 w-full flex flex-col relative">
      {role === "customer" && <CustomerDashboard />}
      {role === "driver" && <DriverDashboard />}
      {role === "admin" && <AdminDashboard />}
      {role === "staff" && <StaffDashboard />}
      
      {/* Role Switcher Floating Action Button (for simulation purposes only) */}
      <div className="fixed top-20 right-4 z-[999] bg-white p-2 rounded-xl shadow-lg border border-gray-200 text-xs flex flex-col gap-1">
        <div className="text-gray-400 font-bold px-2 py-1 uppercase text-[10px]">Mock Auth</div>
        <RoleSwitcher role="customer" current={role} />
        <RoleSwitcher role="driver" current={role} />
        <RoleSwitcher role="staff" current={role} />
        <RoleSwitcher role="admin" current={role} />
      </div>
    </main>
  );
}

function RoleSwitcher({ role, current }) {
  const { setRole } = useAuth();
  return (
    <button
      onClick={() => setRole(role)}
      className={`px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
        current === role ? "bg-orange-100 text-orange-700" : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </button>
  );
}
