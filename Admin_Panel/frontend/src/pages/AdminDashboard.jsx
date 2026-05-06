import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../store/slices/adminSlice";

const statCards = [
  { key: "users", label: "Total Users" },
  { key: "jobs", label: "Total Jobs" },
  { key: "proposals", label: "Total Proposals" },
  { key: "pendingReports", label: "Pending Reports" }
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{stats[card.key] ?? 0}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
