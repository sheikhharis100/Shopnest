import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../redux/slices/authSlice.js';
import api from '../utils/api.js';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShoppingCart, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useToast } from '../components/ToastContext.js';

/* ---------- tiny inline styles for things Tailwind can't express cleanly ---------- */
const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    fontFamily: "'Inter', sans-serif",
  },
  panel: {
    background: 'linear-gradient(135deg, #1a2b4a 0%, #0f3460 45%, #e07b23 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '3.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-80px', right: '-80px',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
  },
  blob2: {
    position: 'absolute', bottom: '-60px', left: '-60px',
    width: '220px', height: '220px', borderRadius: '50%',
    background: 'rgba(224,123,35,0.18)',
  },
  blob3: {
    position: 'absolute', top: '45%', right: '10%',
    width: '120px', height: '120px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
  },
};

const perks = [
  'Free shipping on orders over $100',
  'Exclusive deals & early access',
  '30-day hassle-free returns',
  'Secure & encrypted payments',
];

/* ---- Password strength helper ---- */
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' };
  return { level: 3, label: 'Strong', color: '#22c55e' };
};

const RegisterPage = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast    = useToast();

  const strength = getStrength(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast?.('Passwords do not match', 'error'); return; }
    if (password.length < 6)  { toast?.('Password must be at least 6 characters', 'error'); return; }
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', { name, email, password });
      dispatch(setCredentials(data));
      toast?.(`Welcome to ShopNest, ${data.name}! 🎉`, 'success');
      navigate('/');
    } catch (err) {
      toast?.(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={styles.page}>
        {/* ─── LEFT BRANDING PANEL ─── */}
        <div style={styles.panel}>
          <div style={styles.blob1} />
          <div style={styles.blob2} />
          <div style={styles.blob3} />

          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', marginBottom:'3rem', position:'relative', zIndex:1 }}
          >
            <div style={{
              background:'linear-gradient(135deg,#e07b23,#f0a050)',
              borderRadius:'12px', padding:'8px',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <FiShoppingCart style={{ color:'#fff', fontSize:'22px' }} />
            </div>
            <span style={{ color:'#fff', fontWeight:800, fontSize:'22px', letterSpacing:'-0.5px' }}>ShopNest</span>
          </div>

          {/* Headline */}
          <div style={{ position:'relative', zIndex:1, marginBottom:'2.5rem' }}>
            <h2 style={{
              color:'#fff', fontWeight:800, fontSize:'2.2rem',
              lineHeight:1.15, marginBottom:'0.75rem',
            }}>
              Start shopping<br />
              <span style={{ color:'#f0a050' }}>smarter today.</span>
            </h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.95rem', maxWidth:'300px', lineHeight:1.6 }}>
              Join thousands of happy shoppers who find the best deals every day on ShopNest.
            </p>
          </div>

          {/* Perks */}
          <ul style={{ listStyle:'none', margin:0, padding:0, position:'relative', zIndex:1 }}>
            {perks.map((p) => (
              <li key={p} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.85rem' }}>
                <span style={{
                  width:'22px', height:'22px', borderRadius:'50%',
                  background:'rgba(240,160,80,0.22)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <FiCheck style={{ color:'#f0a050', fontSize:'13px', strokeWidth:3 }} />
                </span>
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.875rem' }}>{p}</span>
              </li>
            ))}
          </ul>

          {/* Trust badge */}
          <div style={{
            position:'relative', zIndex:1,
            marginTop:'3rem', padding:'12px 18px',
            background:'rgba(255,255,255,0.07)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:'12px', display:'flex', alignItems:'center', gap:'10px',
          }}>
            <span style={{ fontSize:'22px' }}>🔐</span>
            <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem', lineHeight:1.4 }}>
              256-bit encryption. Your data is always safe with us.
            </span>
          </div>
        </div>

        {/* ─── RIGHT FORM PANEL ─── */}
        <div style={{
          background:'#f8f9fb',
          display:'flex', flexDirection:'column',
          justifyContent:'center', alignItems:'center',
          padding:'2.5rem 3rem',
          overflowY:'auto',
        }}>
          <div style={{ width:'100%', maxWidth:'400px' }}>
            {/* Header */}
            <div style={{ marginBottom:'2rem' }}>
              <h1 style={{ fontSize:'1.75rem', fontWeight:800, color:'#111827', marginBottom:'6px', letterSpacing:'-0.5px' }}>
                Create your account
              </h1>
              <p style={{ color:'#6b7280', fontSize:'0.9rem' }}>
                Already have one?{' '}
                <Link to="/login" style={{ color:'#e07b23', fontWeight:600, textDecoration:'none' }}>
                  Sign in →
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
              {/* Full Name */}
              <Field label="Full Name">
                <InputWrap icon={<FiUser />}>
                  <input
                    id="register-name" type="text" required value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Muhammad Haris"
                    style={inputStyle}
                  />
                </InputWrap>
              </Field>

              {/* Email */}
              <Field label="Email Address">
                <InputWrap icon={<FiMail />}>
                  <input
                    id="register-email" type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </InputWrap>
              </Field>

              {/* Password */}
              <Field label="Password">
                <InputWrap icon={<FiLock />} suffix={
                  <button type="button" onClick={() => setShowPass(s => !s)} style={eyeBtn}>
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                }>
                  <input
                    id="register-password" type={showPass ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{ ...inputStyle, paddingRight:'2.75rem' }}
                  />
                </InputWrap>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop:'8px' }}>
                    <div style={{ display:'flex', gap:'4px', marginBottom:'4px' }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{
                          flex:1, height:'4px', borderRadius:'2px',
                          background: i <= strength.level ? strength.color : '#e5e7eb',
                          transition:'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize:'0.75rem', color: strength.color, fontWeight:600 }}>
                      {strength.label} password
                    </span>
                  </div>
                )}
              </Field>

              {/* Confirm Password */}
              <Field label="Confirm Password">
                <InputWrap icon={<FiLock />} suffix={
                  <button type="button" onClick={() => setShowConf(s => !s)} style={eyeBtn}>
                    {showConf ? <FiEyeOff /> : <FiEye />}
                  </button>
                }>
                  <input
                    id="register-confirm" type={showConf ? 'text' : 'password'} required
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    style={{
                      ...inputStyle, paddingRight:'2.75rem',
                      borderColor: confirm.length > 0 ? (passwordsMatch ? '#22c55e' : '#ef4444') : '#e5e7eb',
                    }}
                  />
                </InputWrap>
                {confirm.length > 0 && (
                  <p style={{ fontSize:'0.75rem', marginTop:'4px', color: passwordsMatch ? '#22c55e' : '#ef4444', fontWeight:500 }}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </Field>

              {/* Terms */}
              <p style={{ fontSize:'0.78rem', color:'#9ca3af', lineHeight:1.5 }}>
                By creating an account you agree to our{' '}
                <span style={{ color:'#e07b23', cursor:'pointer' }}>Terms of Service</span> and{' '}
                <span style={{ color:'#e07b23', cursor:'pointer' }}>Privacy Policy</span>.
              </p>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                style={{
                  background: loading ? '#f0a050' : 'linear-gradient(135deg, #e07b23, #f0a050)',
                  color:'#fff', border:'none', borderRadius:'12px',
                  padding:'14px', fontWeight:700, fontSize:'1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                  transition:'all 0.2s', boxShadow:'0 4px 18px rgba(224,123,35,0.35)',
                  marginTop:'0.25rem',
                }}
                onMouseEnter={e => { if(!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
              >
                {loading ? (
                  <>
                    <svg style={{ animation:'spin 1s linear infinite', width:'18px', height:'18px' }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M4 12a8 8 0 018-8" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>Create Account <FiArrowRight /></>
                )}
              </button>
            </form>

            {/* Divider + social trust */}
            <div style={{ marginTop:'1.75rem', textAlign:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1rem' }}>
                <div style={{ flex:1, height:'1px', background:'#e5e7eb' }} />
                <span style={{ color:'#9ca3af', fontSize:'0.8rem', whiteSpace:'nowrap' }}>trusted by 50,000+ shoppers</span>
                <div style={{ flex:1, height:'1px', background:'#e5e7eb' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'center', gap:'1.25rem' }}>
                {['🔒 Secure', '📦 Fast Delivery', '↩ Easy Returns'].map(t => (
                  <span key={t} style={{ fontSize:'0.75rem', color:'#6b7280', fontWeight:500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

/* ─── Tiny helper sub-components ─── */

const Field = ({ label, children }) => (
  <div>
    <label style={{ display:'block', fontSize:'0.85rem', fontWeight:600, color:'#374151', marginBottom:'6px' }}>
      {label}
    </label>
    {children}
  </div>
);

const InputWrap = ({ icon, suffix, children }) => (
  <div style={{ position:'relative' }}>
    <span style={{
      position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)',
      color:'#9ca3af', fontSize:'15px', pointerEvents:'none', display:'flex',
    }}>
      {icon}
    </span>
    {children}
    {suffix && (
      <span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)' }}>
        {suffix}
      </span>
    )}
  </div>
);

const inputStyle = {
  width:'100%', boxSizing:'border-box',
  padding:'11px 12px 11px 38px',
  border:'1.5px solid #e5e7eb', borderRadius:'10px',
  fontSize:'0.9rem', color:'#111827',
  background:'#fff', outline:'none',
  transition:'border-color 0.2s, box-shadow 0.2s',
  fontFamily:'inherit',
};

const eyeBtn = {
  background:'none', border:'none', cursor:'pointer',
  color:'#9ca3af', display:'flex', alignItems:'center',
  padding:'2px', fontSize:'16px',
};

export default RegisterPage;