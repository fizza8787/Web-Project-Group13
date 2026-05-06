import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalSearch } from "../store/slices/adminSlice";

const GlobalSearch = () => {
  const dispatch = useDispatch();
  const { searchResults, isLoading, error } = useSelector((state) => state.admin);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(globalSearch({ keyword, role, status, limit: 20 }));
    }, 400);
    return () => clearTimeout(id);
  }, [dispatch, keyword, role, status]);

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search users and jobs"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        >
          <option value="">All user roles</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        >
          <option value="">All job statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>
        <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
          Results: {searchResults.counts.users} users, {searchResults.counts.jobs} jobs
        </div>
      </div>

      {isLoading && <p className="text-sm text-slate-400">Searching...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
          <h3 className="mb-3 font-semibold text-white">Users</h3>
          <div className="space-y-2">
            {searchResults.users.map((user) => (
              <div key={user._id} className="rounded border border-slate-800 bg-slate-900 p-3 text-sm">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-slate-300">{user.email}</p>
                <p className="text-xs capitalize text-slate-400">
                  {user.role} | {user.isActive ? "active" : "banned"}
                </p>
              </div>
            ))}
            {searchResults.users.length === 0 && <p className="text-sm text-slate-400">No users found.</p>}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
          <h3 className="mb-3 font-semibold text-white">Jobs</h3>
          <div className="space-y-2">
            {searchResults.jobs.map((job) => (
              <div key={job._id} className="rounded border border-slate-800 bg-slate-900 p-3 text-sm">
                <p className="font-medium text-white">{job.title}</p>
                <p className="line-clamp-2 text-slate-300">{job.description}</p>
                <p className="text-xs text-slate-400">
                  {job.category} | {job.status} | Client: {job.clientId?.name || "Unknown"}
                </p>
              </div>
            ))}
            {searchResults.jobs.length === 0 && <p className="text-sm text-slate-400">No jobs found.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalSearch;
