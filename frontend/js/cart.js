/* ============================================
   Bloom & Co — Cart JS (cart.js)
   ============================================ */

const API = 'http://localhost:3000/api';

function getCart()  { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// ── Place order via API ───────────────────────
async function placeOrder(userId, address, notes) {
  const cart = getCart();
  if (!cart.length) throw new Error('Cart is empty');

  const res = await fetch(API + '/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId || 1,
      items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
      address, notes
    })
  });

  if (!res.ok) throw new Error('Order failed');
  clearCart();
  return await res.json();
}

function clearCart() { saveCart([]); }

// ── Cart totals ───────────────────────────────
function getCartTotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}
function getCartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}