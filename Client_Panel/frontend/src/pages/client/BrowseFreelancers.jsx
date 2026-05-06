import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

export default function BrowseFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [minRating, setMinRating] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [reportingId, setReportingId] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await api.get('/users', {
          params: {
            search,
            skill,
            minRating,
            minHourlyRate: minPrice,
            maxHourlyRate: maxPrice,
            availability,
            sortBy,
          },
        });
        setFreelancers(r.data.freelancers);
      } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, skill, minRating, minPrice, maxPrice, availability, sortBy]);

  const reportFreelancer = async (freelancerId) => {
    const reason = window.prompt('Enter report reason');
    if (!reason) return;
    try {
      setReportingId(freelancerId);
      await api.post('/reports', { reportedUser: freelancerId, reason });
      window.alert('Report submitted successfully.');
    } catch (error) {
      window.alert(error?.response?.data?.message || 'Failed to submit report.');
    } finally {
      setReportingId('');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .search-input { padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-size: 14px; outline: none; transition: all 0.3s; }
        .search-input:focus { border-color: #818cf8; background: rgba(129,140,248,0.08); }
        .search-input::placeholder { color: rgba(255,255,255,0.25); }
        .fl-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; transition: all 0.3s; animation: fadeIn 0.4s ease forwards; }
        .fl-card:hover { transform: translateY(-4px); border-color: rgba(129,140,248,0.3); background: rgba(255,255,255,0.07); }
      `}</style>

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 700, margin: 0 }}>Browse Freelancers 🔍</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Find the perfect talent for your project</p>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          <input className="search-input" style={{ flex: 1 }} placeholder="🔍  Search by name or skill..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <input className="search-input" placeholder="Filter by skill..."
            value={skill} onChange={e => setSkill(e.target.value)} />
          <select className="search-input" value={minRating} onChange={e => setMinRating(e.target.value)}>
            <option value="">Min Rating</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
          <input className="search-input" type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <input className="search-input" type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          <select className="search-input" value={availability} onChange={e => setAvailability(e.target.value)}>
            <option value="">Availability</option>
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="busy">Busy</option>
          </select>
          <select className="search-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="rating">Top Rated</option>
            <option value="priceLowToHigh">Price Low-High</option>
            <option value="priceHighToLow">Price High-Low</option>
          </select>
        </div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Searching...</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {freelancers.map((f, i) => (
            <div key={f._id} className="fl-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '18px'
                }}>{f.name?.[0]?.toUpperCase()}</div>
                <div>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px', margin: 0 }}>{f.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: '3px 0 0' }}>{f.email}</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: '0 0 14px', lineHeight: '1.5' }}>
                {f.bio || 'No bio provided.'}
              </p>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ color: '#fbbf24', fontSize: '12px' }}>⭐ {Number(f.rating || 0).toFixed(1)}</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>PKR {Number(f.hourlyRate || 0).toLocaleString()}/hr</span>
                <span style={{ color: f.availability === 'available' ? '#34d399' : f.availability === 'limited' ? '#fbbf24' : '#f87171', fontSize: '12px', textTransform: 'capitalize' }}>
                  {f.availability || 'available'}
                </span>
              </div>
              {f.skills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {f.skills.slice(0, 5).map(s => (
                    <span key={s} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: '6px', padding: '3px 10px', fontSize: '12px' }}>{s}</span>
                  ))}
                </div>
              )}
              <button
                onClick={() => reportFreelancer(f._id)}
                disabled={reportingId === f._id}
                style={{
                  marginTop: '14px',
                  background: 'rgba(239,68,68,0.2)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {reportingId === f._id ? 'Submitting...' : 'Report Freelancer'}
              </button>
            </div>
          ))}
          {!loading && freelancers.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: '40px', margin: '0 0 12px' }}>🔍</p>
              <p style={{ margin: 0 }}>No freelancers found. Try a different search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}