import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports, resolveReport } from "../store/slices/adminSlice";

const Reports = () => {
  const dispatch = useDispatch();
  const { reports } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 text-lg font-semibold">Reports & Abuse Monitoring</h3>

      <div className="space-y-3">
        {reports.map((report) => (
          <article key={report._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <div className="flex flex-col justify-between gap-2 md:flex-row">
              <div>
                <p className="font-medium text-white">{report.reportedUser?.name || "Unknown user"}</p>
                <p className="text-sm text-slate-400">{report.reportedUser?.email || "No email"}</p>
                <p className="mt-2 text-sm text-slate-300">Reason: {report.reason}</p>
              </div>
              <div className="flex items-start gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    report.status === "pending" ? "bg-amber-600/20 text-amber-300" : "bg-emerald-600/20 text-emerald-300"
                  }`}
                >
                  {report.status}
                </span>
                {report.status === "pending" && (
                  <button
                    onClick={() => dispatch(resolveReport(report._id))}
                    className="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Reports;
