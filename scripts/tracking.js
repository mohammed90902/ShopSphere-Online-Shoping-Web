// ✅ scripts/tracking.js (CHECK CANCELED PRODUCT)

import { products } from '../data/products.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

const container = document.querySelector('.js-order-tracking');

const trackingData = JSON.parse(localStorage.getItem('tracking'));
const orders = JSON.parse(localStorage.getItem('orders')) || [];

if (
  !trackingData ||
  !orders[trackingData.orderIndex] ||
  !orders[trackingData.orderIndex].items[trackingData.itemIndex] ||
  orders[trackingData.orderIndex].items[trackingData.itemIndex].canceled
) {
  container.innerHTML = `
    <div class="empty-tracking">
      No tracking data available (product may be canceled).
      <br><br>
      <a href="orders.html" class="link-primary">Back to orders</a>
    </div>
  `;
} else {
  const { orderIndex, itemIndex } = trackingData;
  const order = orders[orderIndex];
  const item = order.items[itemIndex];
  const product = products.find(p => p.id === item.productId);
  const delivery = deliveryOptions.find(o => String(o.id) === String(item.deliveryOptionId)) || deliveryOptions[0];

  const deliveryDate = dayjs(order.date).add(delivery.deliveryDays, 'days').format('dddd, MMMM D');

  container.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">View all orders</a>

    <div class="delivery-date">
      Arriving on ${deliveryDate}
    </div>

    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${item.quantity}</div>
    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label">Preparing</div>
      <div class="progress-label current-status">Shipped</div>
      <div class="progress-label">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width:50%"></div>
    </div>
  `;
}
