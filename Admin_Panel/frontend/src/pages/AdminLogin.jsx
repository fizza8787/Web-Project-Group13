import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../store/slices/authSlice";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, isLoading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token && user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [token, user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin(form));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-bold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Access moderation, analytics, and platform controls.</p>

        <label className="mt-6 block text-sm text-slate-300">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
          placeholder="admin@freelancehub.com"
        />

        <label className="mt-4 block text-sm text-slate-300">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-brand-500 focus:outline-none"
          placeholder="Enter password"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
