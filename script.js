// script.js

// Get cart from localStorage or return empty array
function getCart() {
  const cartStr = localStorage.getItem('cart');
  if (!cartStr) return [];
  try {
    return JSON.parse(cartStr);
  } catch {
    return [];
  }
}

// Save cart array to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart from "Add to Cart" button on index or product page
function addToCart(button) {
  // Detect if called from index page or product page
  if (button.closest('.product-card')) {
    // From index.html product card
    const card = button.closest('.product-card');
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const image = card.dataset.image;
    const qtyInput = card.querySelector('.qty-input');
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1) qty = 1;

    let cart = getCart();

    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({ id, name, price, qty, image });
    }

    saveCart(cart);
    alert(`${name} (x${qty}) added to cart!`);
    qtyInput.value = 1;
  } else if (button.id === 'add-to-cart-btn') {
    // From product.html add to cart button
    const id = getProductId();
    if (!id) {
      alert('No product selected.');
      return;
    }

    const product = products.find(p => p.id === id);
    if (!product) {
      alert('Product not found.');
      return;
    }

    const qtyInput = document.getElementById('product-qty');
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1) {
      alert('Please enter a valid quantity.');
      qtyInput.value = 1;
      return;
    }

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, qty: qty, image: product.image });
    }

    saveCart(cart);
    alert(`${product.name} (x${qty}) added to cart!`);
    qtyInput.value = 1;
  } else {
    alert('Add to cart error: button context unknown.');
  }
}

// Remove item from cart by id
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  // Refresh cart page if needed
  if (typeof renderCart === 'function') renderCart();
}

// Update quantity of a cart item (id, newQty)
function updateCartQty(id, newQty) {
  if (newQty < 1) return; // don't allow zero or negative qty
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  cart[itemIndex].qty = newQty;
  saveCart(cart);

  // Refresh cart display if exists
  if (typeof renderCart === 'function') renderCart();
}

// Helper to get product ID from URL (used in product.html)
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}
