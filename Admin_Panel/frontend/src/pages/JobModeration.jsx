import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteJob, fetchJobs, syncJobBudgets, updateJobStatus } from "../store/slices/adminSlice";

const JobModeration = () => {
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.admin);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(fetchJobs({ keyword, status }));
    }, 400);
    return () => clearTimeout(id);
  }, [dispatch, keyword, status]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search jobs by title, skill, category"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="flagged">Flagged</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="open">Open</option>
        </select>
        <button
          onClick={async () => {
            await dispatch(syncJobBudgets());
            dispatch(fetchJobs({ keyword, status }));
          }}
          className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Sync PKR/USD
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <article key={job._id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{job.title}</h3>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs capitalize text-slate-300">{job.status}</span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-slate-300">{job.description}</p>
            <p className="mt-2 text-xs text-slate-400">Category: {job.category}</p>
            <p className="text-xs text-slate-400">
              Budget: PKR {Number(job.budget || 0).toLocaleString()} | USD{" "}
              {Number(job.budgetUSD || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400">Client: {job.clientId?.name || "Unknown"}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => dispatch(updateJobStatus({ id: job._id, status: "approved" }))}
                className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Approve
              </button>
              <button
                onClick={() => dispatch(updateJobStatus({ id: job._id, status: "rejected" }))}
                className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
              >
                Reject
              </button>
              <button
                onClick={() => dispatch(updateJobStatus({ id: job._id, status: "flagged" }))}
                className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Flag
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Delete this job permanently?")) dispatch(deleteJob(job._id));
                }}
                className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default JobModeration;
