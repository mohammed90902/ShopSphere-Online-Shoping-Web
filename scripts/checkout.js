import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

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
    <div class="cart-item-container">
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
            $${matchingProduct.price}
          </div>

          <div class="product-quantity">
            <span>
              Quantity:
              <span class="quantity-label">${cartItem.quantity}</span>
            </span>

            <span class="update-quantity-link link-primary">Update</span>
            <span class="delete-quantity-link link-primary">Delete</span>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-cart-summary').innerHTML = cartHTML;
