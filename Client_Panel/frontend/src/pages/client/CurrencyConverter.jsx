import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRate } from '../../app/slices/currencySlice';
import Navbar from '../../components/Navbar';

export default function CurrencyConverter() {
  const dispatch = useDispatch();
  const { rates, loading } = useSelector(s => s.currency);
  const [pkr, setPkr] = useState('');
  const [usd, setUsd] = useState('');

  useEffect(() => { dispatch(fetchRate()); }, [dispatch]);

  const pkrRate = rates ? parseFloat(rates.PKR) : null;

  const handlePkrChange = (val) => {
    setPkr(val);
    if (pkrRate && val) setUsd((val / pkrRate).toFixed(2));
    else setUsd('');
  };

  const handleUsdChange = (val) => {
    setUsd(val);
    if (pkrRate && val) setPkr((val * pkrRate).toFixed(2));
    else setPkr('');
  };

  const commonAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d1a', fontFamily: "'Segoe UI', sans-serif" }}>
      <Navbar />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .currency-input { width: 100%; padding: 18px 20px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; color: white; font-size: 22px; font-weight: 600; outline: none; transition: all 0.3s; box-sizing: border-box; }
        .currency-input:focus { border-color: #818cf8; background: rgba(129,140,248,0.1); box-shadow: 0 0 0 3px rgba(129,140,248,0.12); }
        .currency-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; font-size: 18px; }
        .quick-btn { padding: 9px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: rgba(255,255,255,0.5); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .quick-btn:hover { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); color: white; }
      `}</style>

      <main style={{ marginLeft: '240px', flex: 1, padding: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '560px', animation: 'fadeIn 0.5s ease forwards' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 700, margin: 0 }}>Currency Converter 💱</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Live PKR ⇄ USD rates via CurrencyFreaks API</p>
          </div>

          {/* Rate Display */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(129,140,248,0.3)', borderRadius: '16px',
            padding: '20px 24px', marginBottom: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, animation: 'pulse 1.5s infinite' }}>Fetching live rate...</p>
            ) : pkrRate ? (
              <>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Exchange Rate</p>
                  <p style={{ color: 'white', fontSize: '22px', fontWeight: 700, margin: 0 }}>1 USD = <span style={{ color: '#10b981' }}>PKR {pkrRate.toFixed(2)}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 4px' }}>1 PKR</p>
                  <p style={{ color: '#818cf8', fontWeight: 600, margin: 0 }}>= ${(1/pkrRate).toFixed(5)}</p>
                </div>
              </>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Rate unavailable</p>
            )}
          </div>

          {/* Converter */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            {/* PKR Input */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>🇵🇰 Pakistani Rupee (PKR)</label>
              </div>
              <input className="currency-input" type="number" placeholder="0"
                value={pkr} onChange={e => handlePkrChange(e.target.value)} />
            </div>

            {/* Swap Icon */}
            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '24px', color: 'rgba(255,255,255,0.2)' }}>⇅</div>

            {/* USD Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>🇺🇸 US Dollar (USD)</label>
              <input className="currency-input" type="number" placeholder="0"
                value={usd} onChange={e => handleUsdChange(e.target.value)} />
            </div>

            {/* Quick amounts */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '10px' }}>Quick amounts (PKR):</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {commonAmounts.map(amt => (
                  <button key={amt} className="quick-btn" onClick={() => handlePkrChange(amt)}>
                    {amt >= 100000 ? `${amt/1000}k` : amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', marginTop: '16px' }}>
            Powered by CurrencyFreaks API • Rates update in real-time
          </p>
        </div>
      </main>
    </div>
  );
}