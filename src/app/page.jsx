
import { useAuth } from "@/lib/AuthContext";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";
import DriverDashboard from "@/components/dashboards/DriverDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import StaffDashboard from "@/components/dashboards/StaffDashboard";

export default function Home() {
  const { role } = useAuth();

  return (
    <main className="flex-1 w-full flex flex-col relative bg-[var(--surface-2)]">
      {role === "customer" && <CustomerDashboard />}
      {role === "driver" && <DriverDashboard />}
      {role === "admin" && <AdminDashboard />}
      {role === "staff" && <StaffDashboard />}

      <div className="fixed top-20 right-4 z-50 hidden w-44 flex-col gap-2 rounded-2xl border border-[var(--border)] bg-white/95 p-2.5 shadow-lg backdrop-blur md:flex">
        <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-4)]">Mock Auth</div>
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
  const isActive = current === role;

  return (
    <button
      onClick={() => setRole(role)}
      className={`rounded-xl px-3 py-2 text-left text-sm font-semibold transition-all ${
        isActive
          ? "bg-[var(--brand-light)] text-[var(--brand)]"
          : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </button>
  );
}
