import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../app/slices/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { label: 'Post a Job', icon: '✏️', path: '/post-job' },
  { label: 'My Jobs', icon: '💼', path: '/my-jobs' },
  { label: 'Browse Freelancers', icon: '🔍', path: '/browse-freelancers' },
  { label: 'Currency', icon: '💱', path: '/currency' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(s => s.auth);

  return (
    <>
      <style>{`
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: 10px; text-decoration: none; color: rgba(255,255,255,0.5); font-size: 14px; font-weight: 500; transition: all 0.2s; }
        .nav-item:hover { background: rgba(255,255,255,0.07); color: white; }
        .nav-item.active { background: rgba(99,102,241,0.2); color: white; border: 1px solid rgba(99,102,241,0.3); }
        .logout-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: 10px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(239,68,68,0.2); }
      `}</style>

      <aside style={{
        width: '240px', minHeight: '100vh', position: 'fixed', left: 0, top: 0,
        background: 'rgba(15,12,41,0.95)', backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Segoe UI', sans-serif", zIndex: 100, padding: '24px 16px'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
            }}>🚀</div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>FreelanceHub</span>
          </div>
        </div>

        {/* User info */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
          padding: '14px', marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '14px'
            }}>{user?.name?.[0]?.toUpperCase() || 'C'}</div>
            <div>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0 }}>{user?.name || 'Client'}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>Client Account</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 8px', marginBottom: '8px' }}>Menu</p>
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button className="logout-btn" onClick={() => { dispatch(logout()); navigate('/login'); }}>
          <span>🚪</span> Logout
        </button>
      </aside>
    </>
  );
}