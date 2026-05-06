import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../app/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === 'fulfilled') navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif", padding: '20px'
    }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .input-field { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: white; font-size: 15px; outline: none; transition: all 0.3s; box-sizing: border-box; }
        .input-field:focus { border-color: #818cf8; background: rgba(129,140,248,0.1); box-shadow: 0 0 0 3px rgba(129,140,248,0.15); }
        .input-field::placeholder { color: rgba(255,255,255,0.35); }
        .role-btn { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s; }
        .role-btn.active { background: rgba(99,102,241,0.25); border-color: #818cf8; color: white; }
        .btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
      `}</style>

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        animation: 'slideUp 0.5s ease forwards',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '16px', margin: '0 auto 16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '24px',
            boxShadow: '0 8px 20px rgba(99,102,241,0.4)'
          }}>🚀</div>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 700, margin: 0 }}>Join FreelanceHub</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>Create your account to get started</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
            color: '#fca5a5', fontSize: '14px'
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Full Name</label>
            <input className="input-field" placeholder="John Doe"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Email Address</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Password</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>I am a...</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['client', 'freelancer'].map(r => (
                <button key={r} type="button" className={`role-btn ${form.role === r ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: r })}>
                  {r === 'client' ? '💼 Client' : '👨‍💻 Freelancer'}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}