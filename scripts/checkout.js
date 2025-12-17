import { cart, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// ---------------- RENDER CART ----------------
function renderCart() {
  let cartHTML = '';

  cart.forEach((cartItem) => {
    let matchingProduct;

    Object.values(products).forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingProduct = product;
      }
    });

    if (!matchingProduct) return;

    // find selected delivery option
    const selectedDeliveryOption = deliveryOptions.find(
      (option) => option.id === cartItem.deliveryOptionId
    ) || deliveryOptions[0];

    const deliveryDate = dayjs().add(
      selectedDeliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartHTML += `
      <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>

            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>

            <div class="product-quantity">
              <span>
                Quantity:
                <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <span class="update-quantity-link link-primary">Update</span>
              <span
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${cartItem.productId}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>

            ${deliveryOptionsHTML(cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  const cartSummaryElement = document.querySelector('.js-cart-summary');
  if (cartSummaryElement) {
    cartSummaryElement.innerHTML = cartHTML;
  }

  // delete buttons
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) container.remove();
    });
  });
}

// ---------------- DELIVERY OPTIONS HTML ----------------
function deliveryOptionsHTML(cartItem) {
  let html = '';

  deliveryOptions.forEach((option) => {
    const deliveryDate = dayjs().add(option.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    const priceString =
      option.priceCents === 0
        ? 'FREE Shipping'
        : `$${formatCurrency(option.priceCents)} - Shipping`;

    const isChecked = option.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option">
        <input
          type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${cartItem.productId}"
        >
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString}</div>
        </div>
      </div>
    `;
  });

  return html;
}

// initial render
renderCart();
