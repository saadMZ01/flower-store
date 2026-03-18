/* ============================================
   Bloom & Co — Shop JS (shop.js)
   ============================================ */

const API = 'http://localhost:3000/api';

// ── Cart ──────────────────────────────────────
function getCart()  { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}
function addToCart(id, name, price) {
  const cart = getCart();
  const ex   = cart.find(i => i.id === id);
  if (ex) ex.qty++;
  else cart.push({ id, name, price, qty: 1 });
  saveCart(cart);
  showToast('"' + name + '" added to cart!');
}
function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}
function updateQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart(cart);
}
function clearCart() { saveCart([]); }

// ── Toast ─────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Navbar scroll effect ──────────────────────
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Init cart count on page load ──────────────
document.addEventListener('DOMContentLoaded', () => {
  saveCart(getCart());
});