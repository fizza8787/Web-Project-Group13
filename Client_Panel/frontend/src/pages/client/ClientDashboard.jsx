import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyJobs } from '../../app/slices/jobSlice';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const { myJobs } = useSelector(s => s.jobs);
  const { user } = useSelector(s => s.auth);

  useEffect(() => { dispatch(fetchMyJobs()); }, [dispatch]);

  const openJobs   = myJobs.filter(j => j.status === 'open').length;
  const activeJobs = myJobs.filter(j => j.status === 'in-progress').length;
  const closedJobs = myJobs.filter(j => j.status === 'closed').length;

  const stats = [
    { label: 'Total Jobs', value: myJobs.length, icon: '📋', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { label: 'Open Jobs',  value: openJobs,       icon: '🟢', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'In Progress',value: activeJobs,     icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Closed',     value: closedJobs,     icon: '🔒', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  ];

  const quickLinks = [
    { label: 'Post a Job', icon: '✏️', to: '/post-job', desc: 'Create a new job listing', color: '#6366f1' },
    { label: 'My Jobs',    icon: '💼', to: '/my-jobs',  desc: 'Manage your job posts',   color: '#8b5cf6' },
    { label: 'Browse Freelancers', icon: '🔍', to: '/browse-freelancers', desc: 'Find the right talent', color: '#06b6d4' },
    { label: 'Currency Converter', icon: '💱', to: '/currency', desc: 'PKR ⇄ USD live rates', color: '#10b981' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; transition: all 0.3s; animation: fadeIn 0.5s ease forwards; }
        .stat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); }
        .quick-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; text-decoration: none; transition: all 0.3s; display: block; }
        .quick-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); }
        .job-row { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
        .job-row:hover { background: rgba(255,255,255,0.06); }
      `}</style>

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, margin: 0 }}>
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '15px' }}>
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{
                width: '44px', height: '44px', background: s.bg, borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', marginBottom: '16px'
              }}>{s.icon}</div>
              <p style={{ color: s.color, fontSize: '32px', fontWeight: 700, margin: 0 }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {quickLinks.map((item, i) => (
              <Link key={item.to} to={item.to} className="quick-card" style={{ animationDelay: `${(i + 4) * 0.1}s` }}>
                <div style={{
                  width: '40px', height: '40px', background: `${item.color}22`,
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', marginBottom: '14px'
                }}>{item.icon}</div>
                <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>{item.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Recent Jobs</h2>
            <Link to="/my-jobs" style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myJobs.slice(0, 4).map(job => (
              <div key={job._id} className="job-row">
                <div>
                  <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>{job.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: '3px 0 0' }}>{job.category}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '14px' }}>
                    PKR {job.budget?.toLocaleString()}
                  </span>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                    background: job.status === 'open' ? 'rgba(16,185,129,0.15)' : job.status === 'in-progress' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                    color: job.status === 'open' ? '#10b981' : job.status === 'in-progress' ? '#f59e0b' : '#818cf8'
                  }}>{job.status}</span>
                </div>
              </div>
            ))}
            {myJobs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📭</p>
                <p style={{ margin: 0 }}>No jobs yet. Post your first job!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}