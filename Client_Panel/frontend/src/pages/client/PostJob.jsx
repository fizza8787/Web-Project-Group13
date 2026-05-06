import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createJob } from '../../app/slices/jobSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const CATEGORIES = ['Design', 'Development', 'Writing', 'Video Editing', 'Marketing', 'Other'];

export default function PostJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.jobs);
  const [form, setForm] = useState({ title: '', description: '', budget: '', category: '', skillsRequired: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form, budget: Number(form.budget),
      skillsRequired: form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean)
    };
    const res = await dispatch(createJob(data));
    if (res.meta.requestStatus === 'fulfilled') navigate('/my-jobs');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .field-input { width: 100%; padding: 13px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-size: 15px; outline: none; transition: all 0.3s; box-sizing: border-box; font-family: inherit; }
        .field-input:focus { border-color: #818cf8; background: rgba(129,140,248,0.08); box-shadow: 0 0 0 3px rgba(129,140,248,0.1); }
        .field-input::placeholder { color: rgba(255,255,255,0.25); }
        .cat-btn { padding: 9px 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .cat-btn.active { background: rgba(99,102,241,0.2); border-color: #818cf8; color: white; }
        .cat-btn:hover { background: rgba(255,255,255,0.08); color: white; }
        .submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; color: white; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '640px', animation: 'fadeIn 0.5s ease forwards' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 700, margin: 0 }}>Post a New Job ✏️</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Fill in the details to find the perfect freelancer</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '36px'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Title */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Job Title *</label>
                <input className="field-input" placeholder="e.g. React Developer for E-commerce App"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>

              {/* Description */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Job Description *</label>
                <textarea className="field-input" placeholder="Describe the job requirements, deliverables, and timeline..."
                  rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required
                  style={{ resize: 'vertical', minHeight: '120px' }} />
              </div>

              {/* Budget */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Budget (PKR) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', fontSize: '14px' }}>₨</span>
                  <input className="field-input" type="number" placeholder="e.g. 50000"
                    style={{ paddingLeft: '36px' }}
                    value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required />
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '10px' }}>Category *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" className={`cat-btn ${form.category === c ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, category: c })}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Required Skills</label>
                <input className="field-input" placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                  value={form.skillsRequired} onChange={e => setForm({ ...form, skillsRequired: e.target.value })} />
                {form.skillsRequired && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {form.skillsRequired.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', borderRadius: '6px', padding: '3px 10px', fontSize: '12px' }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <button className="submit-btn" type="submit" disabled={loading || !form.category}>
                {loading ? '⏳ Posting...' : '🚀 Post Job'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}