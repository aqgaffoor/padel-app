import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, TrendingUp, LogOut,
  Plus, Edit, Trash2, X, Save, RefreshCw, ArrowUpRight,
  ArrowDownRight, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import styles from './AdminPortal.module.css';
import { supabase } from '../lib/supabase';

/* ─────────────── AUTH ─────────────── */
const LoginScreen = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      onLogin();
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.loginCard} ${shake ? styles.shake : ''}`}>
        <div className={styles.loginLogo}>
          <span>P.</span>
        </div>
        <h1 className={styles.loginTitle}>Admin Portal</h1>
        <p className={styles.loginSub}>Padel Business Management System</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label>Access PIN</label>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              className={styles.pinInput}
              autoFocus
              maxLength={6}
            />
          </div>
          {error && <div className={styles.loginError}>{error}</div>}
          <button type="submit" className={styles.loginBtn}>Unlock Dashboard</button>
        </form>
      </div>
    </div>
  );
};

/* ─────────────── STAT CARD ─────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className={styles.statCard}>
    <div className={styles.statHeader}>
      <div className={styles.statIcon} style={{ background: color + '22', color }}>
        <Icon size={20} />
      </div>
      {trend !== undefined && (
        <span className={`${styles.trend} ${trend >= 0 ? styles.trendUp : styles.trendDown}`}>
          {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
    {sub && <div className={styles.statSub}>{sub}</div>}
  </div>
);

/* ─────────────── PRODUCT MODAL ─────────────── */
const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    imageUrl: product?.imageUrl || '',
    stock: product?.stock ?? 10,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h2>{product ? 'Edit Product' : 'New Product Listing'}</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.fg}>
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Wilson Carbon Force" />
            </div>
            <div className={styles.fg}>
              <label>Price (ZAR) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" placeholder="2499" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.fg}>
              <label>Image URL</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... or /images/racket.jpg" />
            </div>
            <div className={styles.fg}>
              <label>Stock Quantity</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" placeholder="10" />
            </div>
          </div>
          <div className={styles.fg}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Product features and specifications..." />
          </div>
          <div className={styles.modalFoot}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn}>
              <Save size={16} /> {product ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─────────────── MAIN COMPONENT ─────────────── */
const AdminPortal = () => {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [modalProduct, setModalProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (authed) { fetchAll(); }
  }, [authed]);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from('products').select('*').order('id'),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);
    setProducts(p || []);
    setOrders(o || []);
    setLoading(false);
  };

  /* ── Product CRUD ── */
  const saveProduct = async (form) => {
    let error;
    if (modalProduct?.id) {
      ({ error } = await supabase.from('products').update(form).eq('id', modalProduct.id));
    } else {
      ({ error } = await supabase.from('products').insert([form]));
    }
    if (error) { notify('❌ Error saving product'); } 
    else { notify('✅ Product saved!'); setShowModal(false); fetchAll(); }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) notify('❌ Error deleting');
    else { notify('🗑️ Deleted'); fetchAll(); }
  };

  /* ── Derived Stats ── */
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const lowStock = products.filter(p => p.stock !== null && p.stock < 5);
  const totalInventoryValue = products.reduce((s, p) => s + (p.price * (p.stock || 0)), 0);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className={styles.shell}>
      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>P.</div>
        <nav className={styles.sideNav}>
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'inventory', icon: Package, label: 'Inventory' },
            { id: 'financials', icon: TrendingUp, label: 'Financials' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`${styles.navBtn} ${tab === id ? styles.navActive : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button className={styles.logoutBtn} onClick={() => setAuthed(false)}>
          <LogOut size={18} /> Log Out
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageHeading}>
              {tab === 'overview' && 'Business Overview'}
              {tab === 'orders' && 'Orders'}
              {tab === 'inventory' && 'Inventory'}
              {tab === 'financials' && 'Financials'}
            </h1>
            <p className={styles.pageSubheading}>
              {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button className={styles.refreshBtn} onClick={fetchAll} title="Refresh data">
            <RefreshCw size={16} className={loading ? styles.spin : ''} />
          </button>
        </header>

        {toast && <div className={styles.toast}>{toast}</div>}

        {/* ═══ OVERVIEW ═══ */}
        {tab === 'overview' && (
          <div className={styles.content}>
            <div className={styles.statsGrid}>
              <StatCard icon={TrendingUp} label="Total Revenue" value={`R ${totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} sub={`${orders.length} orders`} color="#caff00" trend={12} />
              <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} sub="All time" color="#4f8ef7" trend={8} />
              <StatCard icon={Package} label="Products" value={products.length} sub={`${lowStock.length} low stock`} color="#f7a94f" />
              <StatCard icon={TrendingUp} label="Avg. Order Value" value={`R ${avgOrder.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} sub="Per transaction" color="#a64ff7" trend={5} />
            </div>

            {lowStock.length > 0 && (
              <div className={styles.alertBox}>
                <AlertTriangle size={18} className={styles.alertIcon} />
                <strong>Low Stock Alert:</strong> {lowStock.map(p => p.name).join(', ')} — restock soon.
              </div>
            )}

            <div className={styles.overviewGrid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Recent Orders</h3>
                <table className={styles.table}>
                  <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.customer_name || '—'}</td>
                        <td className={styles.green}>R {Number(o.total).toLocaleString()}</td>
                        <td>{new Date(o.created_at).toLocaleDateString('en-ZA')}</td>
                        <td><span className={styles.badge}>{o.status}</span></td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="5" className={styles.empty}>No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Stock Summary</h3>
                <div className={styles.stockList}>
                  {products.map(p => (
                    <div key={p.id} className={styles.stockRow}>
                      <span className={styles.stockName}>{p.name}</span>
                      <div className={styles.stockBar}>
                        <div
                          className={`${styles.stockFill} ${(p.stock || 0) < 5 ? styles.stockLow : ''}`}
                          style={{ width: `${Math.min(100, ((p.stock || 0) / 20) * 100)}%` }}
                        />
                      </div>
                      <span className={`${styles.stockNum} ${(p.stock || 0) < 5 ? styles.red : ''}`}>
                        {p.stock ?? '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ORDERS ═══ */}
        {tab === 'orders' && (
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>All Orders</h3>
                <span className={styles.badge}>{orders.length} total</span>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><strong>#{o.id}</strong></td>
                      <td>{o.customer_name || <span className={styles.muted}>Guest</span>}</td>
                      <td>
                        <div className={styles.itemList}>
                          {Array.isArray(o.items) ? o.items.map((item, i) => (
                            <span key={i} className={styles.itemPill}>{item.name} ×{item.quantity}</span>
                          )) : <span className={styles.muted}>—</span>}
                        </div>
                      </td>
                      <td className={styles.green}><strong>R {Number(o.total).toLocaleString()}</strong></td>
                      <td>{new Date(o.created_at).toLocaleString('en-ZA')}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${o.status === 'completed' ? styles.statusGreen : styles.statusOrange}`}>
                          {o.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="6" className={styles.empty}>No orders have been placed yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ INVENTORY ═══ */}
        {tab === 'inventory' && (
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Product Listings</h3>
                <button className={styles.addBtn} onClick={() => { setModalProduct(null); setShowModal(true); }}>
                  <Plus size={16} /> New Listing
                </button>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr><th>ID</th><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>
                        <div className={styles.thumb}>
                          {p.imageUrl
                            ? <img 
                                src={
                                  p.imageUrl.startsWith('http') 
                                    ? p.imageUrl 
                                    : p.imageUrl.startsWith('/padel-app') 
                                      ? p.imageUrl 
                                      : `/padel-app${p.imageUrl.startsWith('/') ? p.imageUrl : '/' + p.imageUrl}`
                                } 
                                alt={p.name} 
                              />
                            : <span className={styles.noImg}>—</span>}
                        </div>
                      </td>
                      <td><strong>{p.name}</strong><div className={styles.muted} style={{fontSize:'0.8rem'}}>{p.description?.substring(0,50)}…</div></td>
                      <td className={styles.green}>R {p.price?.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.stockBadge} ${(p.stock || 0) < 5 ? styles.stockBadgeLow : ''}`}>
                          {p.stock ?? '—'} units
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.editBtn} onClick={() => { setModalProduct(p); setShowModal(true); }}><Edit size={15} /></button>
                          <button className={styles.deleteBtn} onClick={() => deleteProduct(p.id, p.name)}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="6" className={styles.empty}>No products yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ FINANCIALS ═══ */}
        {tab === 'financials' && (
          <div className={styles.content}>
            <div className={styles.statsGrid}>
              <StatCard icon={TrendingUp} label="Gross Revenue" value={`R ${totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} color="#caff00" />
              <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} color="#4f8ef7" />
              <StatCard icon={TrendingUp} label="Average Order" value={`R ${avgOrder.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} color="#a64ff7" />
              <StatCard icon={Package} label="Inventory Value" value={`R ${totalInventoryValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} color="#f7a94f" />
            </div>

            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Revenue Per Transaction</h3>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr><th>Order #</th><th>Customer</th><th>Items Purchased</th><th>Revenue</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.customer_name || '—'}</td>
                      <td>
                        {Array.isArray(o.items) ? o.items.map(i => `${i.name} ×${i.quantity}`).join(', ') : '—'}
                      </td>
                      <td className={styles.green}><strong>R {Number(o.total).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</strong></td>
                      <td>{new Date(o.created_at).toLocaleDateString('en-ZA')}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="5" className={styles.empty}>No revenue data yet. Orders appear here after customers check out.</td></tr>
                  )}
                  {orders.length > 0 && (
                    <tr className={styles.totalRow}>
                      <td colSpan="3"><strong>TOTAL</strong></td>
                      <td className={styles.green}><strong>R {totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</strong></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={modalProduct}
          onClose={() => setShowModal(false)}
          onSave={saveProduct}
        />
      )}
    </div>
  );
};

export default AdminPortal;
