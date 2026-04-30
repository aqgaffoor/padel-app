import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

/* ── Reusable field ── */
const Field = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, autoComplete }) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}</label>
    <div className={styles.inputWrap}>
      <Icon size={16} className={styles.inputIcon} />
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  </div>
);

/* ── Password field with toggle ── */
const PasswordField = ({ label, value, onChange, placeholder, autoComplete }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrap}>
        <Lock size={16} className={styles.inputIcon} />
        <input
          className={styles.input}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
        />
        <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)} tabIndex={-1}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════ */
const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* Sign In */
  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass] = useState('');

  /* Sign Up */
  const [suFirst, setSuFirst] = useState('');
  const [suLast, setSuLast] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suPass, setSuPass] = useState('');
  const [suConfirm, setSuConfirm] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signIn({ email: siEmail, password: siPass });
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (suPass !== suConfirm) { setError('Passwords do not match.'); return; }
    if (suPass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await signUp({ email: suEmail, password: suPass, firstName: suFirst, lastName: suLast, phone: suPhone });
      setSuccess('Account created! Check your email to confirm your address, then sign in.');
      setTab('signin');
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>PADEL.</Link>
        <p className={styles.tagline}>Your game, your account.</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'signin' ? styles.tabActive : ''}`} onClick={() => { setTab('signin'); setError(''); setSuccess(''); }}>
            Sign In
          </button>
          <button className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`} onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}>
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error   && <div className={styles.errorBox}>{error}</div>}
        {success && (
          <div className={styles.successBox}>
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* ─── SIGN IN ─── */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className={styles.form} noValidate>
            <Field label="Email Address" icon={Mail} type="email" value={siEmail} onChange={e => setSiEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            <PasswordField label="Password" value={siPass} onChange={e => setSiPass(e.target.value)} placeholder="Your password" autoComplete="current-password" />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        {/* ─── SIGN UP ─── */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className={styles.form} noValidate>
            <div className={styles.row}>
              <Field label="First Name" icon={User} value={suFirst} onChange={e => setSuFirst(e.target.value)} placeholder="Abdul" required autoComplete="given-name" />
              <Field label="Last Name"  icon={User} value={suLast}  onChange={e => setSuLast(e.target.value)}  placeholder="Smith"  required autoComplete="family-name" />
            </div>
            <Field label="Email Address" icon={Mail}  type="email" value={suEmail} onChange={e => setSuEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            <Field label="Phone Number (optional)" icon={Phone} type="tel"   value={suPhone} onChange={e => setSuPhone(e.target.value)} placeholder="+27 82 000 0000" autoComplete="tel" />
            <PasswordField label="Password (min. 8 characters)" value={suPass}    onChange={e => setSuPass(e.target.value)}    placeholder="Create a password"  autoComplete="new-password" />
            <PasswordField label="Confirm Password"              value={suConfirm} onChange={e => setSuConfirm(e.target.value)} placeholder="Repeat your password" autoComplete="new-password" />

            <p className={styles.privacy}>
              🔒 Your data is encrypted and never shared with third parties.
            </p>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account…' : <><span>Create Account</span><ArrowRight size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
