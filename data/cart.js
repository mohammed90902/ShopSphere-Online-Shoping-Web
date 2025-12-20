// ================= LOAD CART =================
export const cart = JSON.parse(localStorage.getItem('cart')) || [];

// ================= SAVE =================
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ================= ADD TO CART =================
export function addToCart(productId, quantity) {
  const item = cart.find(i => i.productId === productId);

  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

// ================= REMOVE FROM CART =================
export function removeFromCart(productId) {
  const index = cart.findIndex(i => i.productId === productId);
  if (index !== -1) {
    cart.splice(index, 1); // ✅ mutate array
    saveToStorage();
  }
}

// ================= UPDATE QUANTITY =================
export function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;

  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = newQuantity;
    saveToStorage();
  }
}

// ================= UPDATE DELIVERY =================
export function updateDeliveryOption(productId, deliveryOptionId) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;

  item.deliveryOptionId = String(deliveryOptionId);
  saveToStorage();
}

// ================= CLEAR CART =================
export function clearCart() {
  cart.length = 0; // ✅ mutate array
  saveToStorage();
}
