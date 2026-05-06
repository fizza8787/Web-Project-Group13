import { BarChart3, Briefcase, Flag, Home, LogOut, MessageCircle, Search, ShieldCheck, Users } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/jobs", label: "Job Moderation", icon: Briefcase },
  { to: "/admin/search", label: "Search & Filter", icon: Search },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/chatbot", label: "Chatbot", icon: MessageCircle }
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 h-screen w-72 border-r border-slate-800 bg-slate-900/80 p-6 backdrop-blur">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-brand-600 p-2">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-400">FreelanceHub</p>
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
              <p className="text-sm text-slate-400">Centralized moderation and platform monitoring</p>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
