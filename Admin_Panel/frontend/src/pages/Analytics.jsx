import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchStats } from "../store/slices/adminSlice";

const COLORS = ["#7c3aed", "#06b6d4", "#22c55e", "#f59e0b"];

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const data = useMemo(
    () => [
      { name: "Users", value: stats.users },
      { name: "Jobs", value: stats.jobs },
      { name: "Proposals", value: stats.proposals },
      { name: "Pending Reports", value: stats.pendingReports }
    ],
    [stats]
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 text-lg font-semibold">Platform Analytics</h3>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Analytics;
