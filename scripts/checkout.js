import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// ---------------- RENDER CART ----------------
function renderCart() {
  const cartSummaryElement = document.querySelector('.js-cart-summary');
  if (!cartSummaryElement) return console.error('Cart summary element not found');

  let cartHTML = '';

  cart.forEach((cartItem) => {
    // Find the matching product
    let matchingProduct = Array.isArray(products)
      ? products.find(p => p.id === cartItem.productId)
      : products[cartItem.productId] || Object.values(products).find(p => p.id === cartItem.productId);

    if (!matchingProduct) return;

    // Correctly get the selected delivery option
    const selectedDeliveryOption = deliveryOptions.find(
      option => String(option.id) === String(cartItem.deliveryOptionId)
    ) || deliveryOptions[0];

    const deliveryDate = dayjs().add(selectedDeliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartHTML += `
      <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
        <div class="delivery-date">Delivery date: ${dateString}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cartItem.productId}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  cartSummaryElement.innerHTML = cartHTML;

  // Delete buttons
  document.querySelectorAll('.js-delete-link').forEach(link => {
    link.addEventListener('click', () => {
      removeFromCart(link.dataset.productId);
      renderCart();
    });
  });

  // Delivery option radios
  document.querySelectorAll('.js-delivery-option-input').forEach(input => {
    input.addEventListener('change', () => {
      const productId = input.dataset.productId;
      const deliveryOptionId = input.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionId);
      renderCart();
    });
  });
}

// ---------------- DELIVERY OPTIONS HTML ----------------
function deliveryOptionsHTML(cartItem) {
  return deliveryOptions.map(option => {
    const deliveryDate = dayjs().add(option.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = option.priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(option.priceCents)} - Shipping`;
    const isChecked = String(option.id) === String(cartItem.deliveryOptionId);

    return `
      <div class="delivery-option js-delivery-option">
        <input
          type="radio"
          class="delivery-option-input js-delivery-option-input"
          name="delivery-option-${cartItem.productId}"
          data-product-id="${cartItem.productId}"
          data-delivery-option-id="${option.id}"
          id="delivery-option-${cartItem.productId}-${option.id}"
          ${isChecked ? 'checked' : ''}
        >
        <label for="delivery-option-${cartItem.productId}-${option.id}" class="delivery-option-label">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString}</div>
          </div>
        </label>
      </div>
    `;
  }).join('');
}

// Initial render
renderCart();
