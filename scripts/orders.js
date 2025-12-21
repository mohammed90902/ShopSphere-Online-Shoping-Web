// ✅ scripts/orders.js (DYNAMIC TRACKING + CANCEL BADGE)

import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// ---------------- LOAD ORDERS ----------------
const orders = JSON.parse(localStorage.getItem('orders')) || [];

// ---------------- CART COUNT ----------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  cart.forEach(item => {
    if (!item.canceled) total += item.quantity;
  });
  document.querySelector('.cart-quantity').innerText = total;
}

// ---------------- HELPERS ----------------
function getDeliveryOption(id) {
  return deliveryOptions.find(o => String(o.id) === String(id)) || deliveryOptions[0];
}

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

  orders.forEach((order, orderIndex) => {
    let totalCents = 0;

    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && !item.canceled) {
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
        </div>
    `;

    order.items.forEach((item, itemIndex) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      const delivery = getDeliveryOption(item.deliveryOptionId);
      const deliveryDate = dayjs(order.date).add(delivery.deliveryDays, 'days').format('MMMM D');

      html += `
        <div class="order-details-grid ${item.canceled ? 'canceled-product' : ''}">
          <div class="product-image-container">
            <img src="${product.image}">
          </div>

          <div>
            <div class="product-name">${product.name}</div>
            <div class="product-delivery-date">
              ${item.canceled ? 'Order canceled' : `Delivered on ${deliveryDate}`}
            </div>
            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>
          </div>

          <div class="product-actions">
            ${
              !item.canceled
                ? `<button 
                    class="track-package-button button-secondary js-track"
                    data-order-index="${orderIndex}"
                    data-item-index="${itemIndex}">
                    Track package
                  </button>
                  <button 
                    class="cancel-product-button button-secondary js-cancel"
                    data-order-index="${orderIndex}"
                    data-item-index="${itemIndex}">
                    Cancel
                  </button>`
                : ''
            }
          </div>
        </div>
      `;
    });

    html += `</div>`;
  });

  grid.innerHTML = html;

  // ---------------- TRACKING BUTTON EVENT ----------------
  document.querySelectorAll('.js-track').forEach(btn => {
    btn.onclick = () => {
      const orderIndex = btn.dataset.orderIndex;
      const itemIndex = btn.dataset.itemIndex;
      localStorage.setItem('tracking', JSON.stringify({ orderIndex, itemIndex }));
      window.location.href = 'tracking.html';
    };
  });

  // ---------------- CANCEL PRODUCT EVENT ----------------
  document.querySelectorAll('.js-cancel').forEach(btn => {
    btn.onclick = () => {
      const orderIndex = Number(btn.dataset.orderIndex);
      const itemIndex = Number(btn.dataset.itemIndex);

      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders[orderIndex].items[itemIndex].canceled = true;
      localStorage.setItem('orders', JSON.stringify(orders));

      renderOrders();
    };
  });
}

// ---------------- INIT ----------------
updateCartCount();
renderOrders();
