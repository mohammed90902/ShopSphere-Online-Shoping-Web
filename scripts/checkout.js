import { cart, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// Function to render the cart
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

    cartHTML += `
      <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
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
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cartItem.productId}">Delete</span>
            </div>
          </div>

          <!-- DELIVERY OPTIONS -->
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>

            <div class="delivery-option">
              <input type="radio" checked class="delivery-option-input" name="delivery-option-${cartItem.productId}">
              <div>
                <div class="delivery-option-date">Tuesday, June 21</div>
                <div class="delivery-option-price">FREE Shipping</div>
              </div>
            </div>

            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${cartItem.productId}">
              <div>
                <div class="delivery-option-date">Wednesday, June 15</div>
                <div class="delivery-option-price">$4.99 - Shipping</div>
              </div>
            </div>

            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${cartItem.productId}">
              <div>
                <div class="delivery-option-date">Monday, June 13</div>
                <div class="delivery-option-price">$9.99 - Shipping</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  });

  // Render cart HTML
  const cartSummaryElement = document.querySelector('.js-cart-summary');
  if (cartSummaryElement) cartSummaryElement.innerHTML = cartHTML;

  // Attach delete event listeners
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      // Remove from cart array
      removeFromCart(productId);

      // Remove from DOM
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) container.remove();

      console.log('Updated cart:', cart);
    });
  });
}

// Initial render
renderCart();
