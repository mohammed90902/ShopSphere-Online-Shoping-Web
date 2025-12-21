// scripts/orders.js  ✅ COPY–PASTE FULL FILE

import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// ---------------- LOAD ORDERS FROM STORAGE ----------------
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// ---------------- RENDER ORDERS ----------------
function renderOrders() {
  const grid = document.querySelector('.js-orders-grid');

  if (orders.length === 0) {
    grid.innerHTML = `
      <div class="empty-orders">
        You have no orders.
        <br><br>
        <a href="index.html" class="link-primary">Continue shopping</a>
      </div>
    `;
    return;
  }

  let html = '';

  orders.forEach(order => {
    let totalCents = 0;

    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        totalCents += product.priceCents * item.quantity;
      }
    });

    html += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order placed</div>
              <div>${order.date}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total</div>
              <div>$${formatCurrency(totalCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID</div>
            <div>${order.id}</div>
          </div>
        </div>
    `;

    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      html += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${product.image}">
          </div>

          <div>
            <div class="product-name">${product.name}</div>
            <div class="product-delivery-date">
              Delivered on ${dayjs(order.date)
                .add(3, 'days')
                .format('MMMM D')}
            </div>
            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>

            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              Buy it again
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html" class="button-secondary track-package-button">
              Track package
            </a>
          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  grid.innerHTML = html;
}

// ---------------- CART COUNT ----------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  cart.forEach(item => (total += item.quantity));
  document.querySelector('.cart-quantity').innerText = total;
}

// ---------------- INIT ----------------
updateCartCount();
renderOrders();
