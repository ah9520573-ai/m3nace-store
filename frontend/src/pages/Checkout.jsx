import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../api/format';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', line1: '', city: '', phone: '', paymentMethod: 'Cash on Delivery' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const updateField = event => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    try {
      await ordersApi.create({ items, shippingAddress: { name: form.name, line1: form.line1, city: form.city, phone: form.phone }, paymentMethod: form.paymentMethod });
      clear();
      nav('/order-success');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not place order');
    } finally {
      setBusy(false);
    }
  };
  return <main className="section checkout"><div className="page-heading"><p className="eyebrow">FINAL STEP</p><h1>Make it yours.</h1></div><form className="checkout-form" onSubmit={submit}><div><label>Full name<input name="name" required value={form.name} onChange={updateField} /></label><label>Address<input name="line1" required value={form.line1} onChange={updateField} /></label><div className="two"><label>City<input name="city" required value={form.city} onChange={updateField} /></label><label>Phone number<input name="phone" type="tel" required value={form.phone} onChange={updateField} /></label></div><label>Payment<select name="paymentMethod" value={form.paymentMethod} onChange={updateField}><option>Cash on Delivery</option><option>Online payment (coming soon)</option></select></label><p className="hint">Online payment is clearly marked as a placeholder. No card details are collected.</p>{error && <p className="error">{error}</p>}<button className="button" disabled={busy || !items.length}>{busy ? 'Placing order...' : 'Place order'}</button></div><aside className="summary"><h2>In your Cart</h2>{items.map(item => <p key={item.productId}>{item.name} × {item.quantity}<b>{formatPKR(item.price * item.quantity)}</b></p>)}<hr /><p className="grand">Total <b>{formatPKR(total)}</b></p></aside></form></main>;
}
