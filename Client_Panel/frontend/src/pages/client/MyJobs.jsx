import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs, deleteJob, updateJob } from '../../app/slices/jobSlice';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const statusColor = { open: { bg: 'rgba(16,185,129,0.15)', text: '#10b981' }, 'in-progress': { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' }, closed: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' } };

export default function MyJobs() {
  const dispatch = useDispatch();
  const { myJobs, loading } = useSelector(s => s.jobs);
  const [editJob, setEditJob] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(fetchMyJobs()); }, [dispatch]);

  const handleDelete = (id) => { if (window.confirm('Delete this job?')) dispatch(deleteJob(id)); };
  const handleUpdate = (e) => { e.preventDefault(); dispatch(updateJob({ id: editJob._id, data: editJob })); setEditJob(null); };

  const filtered = filter === 'all' ? myJobs : myJobs.filter(j => j.status === filter);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .job-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; transition: all 0.3s; animation: fadeIn 0.4s ease forwards; }
        .job-card:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); }
        .action-btn { padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
        .filter-btn { padding: 8px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.4); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .filter-btn.active { background: rgba(99,102,241,0.2); border-color: #818cf8; color: white; }
        .modal-input { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: white; font-size: 14px; outline: none; box-sizing: border-box; font-family: inherit; }
        .modal-input:focus { border-color: #818cf8; }
      `}</style>

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 700, margin: 0 }}>My Jobs 💼</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>{myJobs.length} total job posts</p>
          </div>
          <Link to="/post-job" style={{
            padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600
          }}>+ Post New Job</Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['all', 'open', 'in-progress', 'closed'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All Jobs' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Loading...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((job, i) => (
            <div key={job._id} className="job-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: 0 }}>{job.title}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, background: statusColor[job.status]?.bg, color: statusColor[job.status]?.text }}>
                      {job.status}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: '0 0 12px' }}>{job.description?.slice(0, 100)}...</p>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: '15px' }}>PKR {job.budget?.toLocaleString()}</span>
                    {job.budgetUSD && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>(${job.budgetUSD} USD)</span>}
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>📁 {job.category}</span>
                  </div>
                  {job.skillsRequired?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {job.skillsRequired.map(s => (
                        <span key={s} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: '6px', padding: '3px 10px', fontSize: '12px' }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                  <Link to={`/proposals/${job._id}`} className="action-btn"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>📋 Proposals</Link>
                  <button className="action-btn" onClick={() => setEditJob({ ...job })}
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>✏️ Edit</button>
                  <button className="action-btn" onClick={() => handleDelete(job._id)}
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: '40px', margin: '0 0 12px' }}>📭</p>
              <p style={{ margin: 0, fontSize: '15px' }}>No jobs found. Post your first job!</p>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '520px' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: '0 0 24px' }}>Edit Job ✏️</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input className="modal-input" placeholder="Job Title" value={editJob.title}
                onChange={e => setEditJob({ ...editJob, title: e.target.value })} />
              <textarea className="modal-input" rows={4} placeholder="Description" value={editJob.description}
                onChange={e => setEditJob({ ...editJob, description: e.target.value })} style={{ resize: 'vertical' }} />
              <input className="modal-input" type="number" placeholder="Budget (PKR)" value={editJob.budget}
                onChange={e => setEditJob({ ...editJob, budget: e.target.value })} />
              <select className="modal-input" value={editJob.status}
                onChange={e => setEditJob({ ...editJob, status: e.target.value })}>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                <button type="button" onClick={() => setEditJob(null)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}