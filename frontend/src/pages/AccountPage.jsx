import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, Edit2, Save, X, LogOut, Package, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import styles from './AccountPage.module.css';

/* ─────────── PROFILE TAB ─────────── */
const ProfileTab = ({ user, profile, updateProfile }) => {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName,  setLastName]  = useState(profile?.last_name  || '');
  const [phone,     setPhone]     = useState(profile?.phone      || '');
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, phone });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleCancel = () => {
    setFirstName(profile?.first_name || '');
    setLastName(profile?.last_name   || '');
    setPhone(profile?.phone          || '');
    setEditing(false);
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          {(profile?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
        </div>
        <div>
          <h2 className={styles.profileName}>
            {profile?.first_name || ''} {profile?.last_name || ''}
          </h2>
          <p className={styles.profileEmail}>{user?.email}</p>
        </div>
      </div>

      {saved && (
        <div className={styles.savedBanner}>
          <CheckCircle size={15} /> Profile updated successfully
        </div>
      )}

      <div className={styles.infoCard}>
        <div className={styles.infoCardHead}>
          <h3>Personal Information</h3>
          {!editing
            ? <button className={styles.editBtn} onClick={() => setEditing(true)}><Edit2 size={15} /> Edit</button>
            : (
              <div className={styles.editActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}><X size={15} /> Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )
          }
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>First Name</span>
            {editing
              ? <input className={styles.infoInput} value={firstName} onChange={e => setFirstName(e.target.value)} />
              : <span className={styles.infoValue}>{profile?.first_name || '—'}</span>
            }
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Last Name</span>
            {editing
              ? <input className={styles.infoInput} value={lastName} onChange={e => setLastName(e.target.value)} />
              : <span className={styles.infoValue}>{profile?.last_name || '—'}</span>
            }
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email Address</span>
            <span className={styles.infoValue}>{user?.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phone Number</span>
            {editing
              ? <input className={styles.infoInput} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27 82 000 0000" />
              : <span className={styles.infoValue}>{profile?.phone || '—'}</span>
            }
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Member Since</span>
            <span className={styles.infoValue}>
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────── ORDERS TAB ─────────── */
const OrdersTab = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    if (userId) load();
  }, [userId]);

  if (loading) return <div className={styles.emptyState}>Loading orders…</div>;

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>Purchase History</h3>
      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <Package size={40} className={styles.emptyIcon} />
          <p>No orders yet.</p>
          <small>Your completed purchases will appear here.</small>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <span className={styles.orderId}>Order #{order.id}</span>
                <span className={`${styles.orderStatus} ${order.status === 'completed' ? styles.statusGreen : styles.statusOrange}`}>
                  {order.status === 'completed' ? <CheckCircle size={13} /> : <Clock size={13} />}
                  {order.status}
                </span>
              </div>
              <div className={styles.orderMeta}>
                <span className={styles.orderDate}>
                  {new Date(order.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className={styles.orderTotal}>R {Number(order.total).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
              </div>
              {Array.isArray(order.items) && order.items.length > 0 && (
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <span key={i} className={styles.itemPill}>{item.name} ×{item.quantity}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────── WISHLIST TAB ─────────── */
const WishlistTab = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>Saved Items</h3>
      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          <Heart size={40} className={styles.emptyIcon} />
          <p>Your wishlist is empty.</p>
          <button className={styles.shopBtn} onClick={() => navigate('/shop')}>Browse the Shop</button>
        </div>
      ) : (
        <div className={styles.wishGrid}>
          {wishlistItems.map(item => (
            <div key={item.id} className={styles.wishCard}>
              <img src={item.imageUrl} alt={item.name} className={styles.wishImg} />
              <div className={styles.wishInfo}>
                <span className={styles.wishName}>{item.name}</span>
                <span className={styles.wishPrice}>R {item.price?.toLocaleString('en-ZA')}</span>
              </div>
              <div className={styles.wishActions}>
                <button className={styles.moveBtn} onClick={() => moveToCart(item)}>Move to Cart</button>
                <button className={styles.removeBtn} onClick={() => removeFromWishlist(item.id)}><X size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════ */
const AccountPage = () => {
  const { user, profile, updateProfile, signOut, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');

  /* Redirect if not logged in */
  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || !isLoggedIn) return null;

  const tabs = [
    { id: 'profile', label: 'Profile',   icon: User },
    { id: 'orders',  label: 'Orders',    icon: ShoppingBag },
    { id: 'wishlist',label: 'Wishlist',  icon: Heart },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideAvatar}>
            {(profile?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
          </div>
          <p className={styles.sideName}>{profile?.first_name || ''} {profile?.last_name || ''}</p>
          <p className={styles.sideEmail}>{user?.email}</p>

          <nav className={styles.sideNav}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`${styles.navBtn} ${tab === id ? styles.navActive : ''}`}
                onClick={() => setTab(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <button className={styles.logoutBtn} onClick={handleSignOut}>
            <LogOut size={17} /> Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {tab === 'profile'  && <ProfileTab  user={user} profile={profile} updateProfile={updateProfile} />}
          {tab === 'orders'   && <OrdersTab   userId={user?.id} />}
          {tab === 'wishlist' && <WishlistTab />}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
