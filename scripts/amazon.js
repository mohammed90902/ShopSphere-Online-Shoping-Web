import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// ---------------- RENDER PRODUCTS ----------------
function renderProducts(productsList) {
  let productsHTML = '';

  productsList.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img
            class="product-image"
            src="${product.image}"
            loading="lazy"
            onerror="this.src='images/no-image.png'">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img
            class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector">
            ${[...Array(10).keys()].map(i =>
              `<option value="${i + 1}">${i + 1}</option>`
            ).join('')}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button
          class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;
  setupAddToCartButtons();
}

// ---------------- CART QUANTITY ----------------
function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

// ---------------- ADD TO CART EVENTS ----------------
function setupAddToCartButtons() {
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const productContainer = button.closest('.product-container');

      const quantity = Number(
        productContainer.querySelector('.js-quantity-selector').value
      );

      addToCart(productId, quantity);
      updateCartQuantity();

      // Added feedback
      const addedMessage = productContainer.querySelector('.added-to-cart');
      addedMessage.classList.add('visible');

      setTimeout(() => {
        addedMessage.classList.remove('visible');
      }, 2000);

      // Prevent spam clicking
      button.disabled = true;
      setTimeout(() => {
        button.disabled = false;
      }, 500);
    });
  });
}

// ---------------- SEARCH ----------------
document.querySelector('.js-search-bar').addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search)
  );

  renderProducts(filteredProducts);
});

// ---------------- INITIAL LOAD ----------------
renderProducts(products);
updateCartQuantity();
