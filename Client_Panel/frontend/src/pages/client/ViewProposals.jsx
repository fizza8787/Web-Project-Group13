import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProposals, updateProposalStatus } from '../../app/slices/proposalSlice';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const statusStyle = {
  pending:  { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b' },
  accepted: { bg: 'rgba(16,185,129,0.15)',  text: '#10b981' },
  rejected: { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444' },
  withdrawn:{ bg: 'rgba(156,163,175,0.15)', text: '#9ca3af' },
};

export default function ViewProposals() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { proposals, loading } = useSelector(s => s.proposals);

  useEffect(() => { dispatch(fetchProposals(jobId)); }, [dispatch, jobId]);

  const handleStatus = (id, status) => dispatch(updateProposalStatus({ id, status }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .proposal-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; transition: all 0.3s; animation: fadeIn 0.4s ease forwards; }
        .proposal-card:hover { border-color: rgba(255,255,255,0.15); }
        .action-btn { padding: 9px 18px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <Link to="/my-jobs" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px' }}>← My Jobs</Link>
          <div>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 700, margin: 0 }}>Proposals Received 📋</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>{proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received</p>
          </div>
        </div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Loading proposals...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {proposals.map((p, i) => (
            <div key={p._id} className="proposal-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {/* Freelancer info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '16px'
                    }}>{p.freelancerId?.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px', margin: 0 }}>{p.freelancerId?.name}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: '3px 0 0' }}>{p.freelancerId?.email}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, marginLeft: '8px',
                      background: statusStyle[p.status]?.bg, color: statusStyle[p.status]?.text
                    }}>{p.status}</span>
                  </div>

                  {/* Cover Letter */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{p.coverLetter}</p>
                  </div>

                  {/* Skills */}
                  {p.freelancerId?.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {p.freelancerId.skills.map(s => (
                        <span key={s} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: '6px', padding: '3px 10px', fontSize: '12px' }}>{s}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '18px' }}>PKR {p.bidAmount?.toLocaleString()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                {p.status === 'pending' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '24px' }}>
                    <button className="action-btn" onClick={() => handleStatus(p._id, 'accepted')}
                      style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      ✅ Accept
                    </button>
                    <button className="action-btn" onClick={() => handleStatus(p._id, 'rejected')}
                      style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {!loading && proposals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: '40px', margin: '0 0 12px' }}>📭</p>
              <p style={{ margin: 0 }}>No proposals received yet. Check back later!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}