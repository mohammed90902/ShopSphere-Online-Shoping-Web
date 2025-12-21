import {
  cart,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity,
  clearCart
} from '../data/cart.js';

import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// ---------------- HELPERS ----------------
function getProduct(productId) {
  return products.find(p => p.id === productId);
}

function getDeliveryOption(id) {
  return deliveryOptions.find(o => String(o.id) === String(id)) || deliveryOptions[0];
}

// ---------------- CART COUNT ----------------
function updateCartCount() {
  const el = document.querySelector('.js-cart-count');
  if (!el) return;

  let total = 0;
  cart.forEach(item => total += item.quantity);
  el.innerHTML = `${total} items`;
}

// ---------------- RENDER CART ----------------
function renderCart() {
  const summary = document.querySelector('.js-cart-summary');

  if (!cart.length) {
    summary.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.
        <br>
        <a href="index.html" class="link-primary">Continue shopping</a>
      </div>
    `;
    document.querySelector('.js-payment-summary').innerHTML = '';
    updateCartCount();
    return;
  }

  let html = '';

  cart.forEach(item => {
    const product = getProduct(item.productId);
    if (!product) return;

    const delivery = getDeliveryOption(item.deliveryOptionId);
    const date = dayjs().add(delivery.deliveryDays, 'days').format('dddd, MMMM D');

    html += `
      <div class="cart-item-container">
        <div class="delivery-date">Delivery date: ${date}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${formatCurrency(product.priceCents)}</div>

            <div class="product-quantity">
              <button class="qty-btn js-decrease" data-id="${product.id}">−</button>
              <span class="quantity-label">${item.quantity}</span>
              <button class="qty-btn js-increase" data-id="${product.id}">+</button>

              <span class="delete-quantity-link link-primary js-delete" data-id="${product.id}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${renderDeliveryOptions(item)}
          </div>
        </div>
      </div>
    `;
  });

  summary.innerHTML = html;

  setupEvents();
  renderPaymentSummary();
  updateCartCount();
}

// ---------------- DELIVERY OPTIONS ----------------
function renderDeliveryOptions(cartItem) {
  return deliveryOptions.map(option => {
    const checked = String(option.id) === String(cartItem.deliveryOptionId) ? 'checked' : '';
    const date = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');
    const price = option.priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(option.priceCents)} Shipping`;

    return `
      <div class="delivery-option">
        <input
          type="radio"
          class="js-delivery"
          name="delivery-${cartItem.productId}"
          data-pid="${cartItem.productId}"
          data-did="${option.id}"
          ${checked}
        >
        <div>
          <div class="delivery-option-date">${date}</div>
          <div class="delivery-option-price">${price}</div>
        </div>
      </div>
    `;
  }).join('');
}

// ---------------- EVENTS ----------------
function setupEvents() {
  document.querySelectorAll('.js-delete').forEach(btn => {
    btn.onclick = () => {
      removeFromCart(btn.dataset.id);
      renderCart();
    };
  });

  document.querySelectorAll('.js-increase').forEach(btn => {
    btn.onclick = () => {
      const item = cart.find(i => i.productId === btn.dataset.id);
      if (!item) return;
      updateQuantity(btn.dataset.id, item.quantity + 1);
      renderCart();
    };
  });

  document.querySelectorAll('.js-decrease').forEach(btn => {
    btn.onclick = () => {
      const item = cart.find(i => i.productId === btn.dataset.id);
      if (!item) return;
      updateQuantity(btn.dataset.id, item.quantity - 1);
      renderCart();
    };
  });

  document.querySelectorAll('.js-delivery').forEach(input => {
    input.onchange = () => {
      updateDeliveryOption(input.dataset.pid, input.dataset.did);
      renderCart();
    };
  });
}

// ---------------- PAYMENT SUMMARY ----------------
function renderPaymentSummary() {
  const el = document.querySelector('.js-payment-summary');
  let itemsTotal = 0;
  let shippingTotal = 0;

  cart.forEach(item => {
    const product = getProduct(item.productId);
    if (!product) return;

    itemsTotal += product.priceCents * item.quantity;
    shippingTotal += getDeliveryOption(item.deliveryOptionId).priceCents;
  });

  const tax = Math.round(itemsTotal * 0.1);
  const total = itemsTotal + shippingTotal + tax;

  el.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row"><span>Items:</span><span>$${formatCurrency(itemsTotal)}</span></div>
    <div class="payment-summary-row"><span>Shipping:</span><span>$${formatCurrency(shippingTotal)}</span></div>
    <div class="payment-summary-row"><span>Tax (10%):</span><span>$${formatCurrency(tax)}</span></div>
    <div class="payment-summary-row total-row"><span>Order total:</span><span>$${formatCurrency(total)}</span></div>

    <button class="place-order-button button-primary js-place-order">Place your order</button>
  `;

  // ---------------- PLACE ORDER ----------------
  document.querySelector('.js-place-order').onclick = () => {
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = {
      id: crypto.randomUUID(),
      date: dayjs().format('YYYY-MM-DD'),
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryOptionId
      }))
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart and redirect
    clearCart();
    renderCart();
    window.location.href = 'orders.html';
  };
}

// ---------------- INIT ----------------
renderCart();
