export let cart = JSON.parse(localStorage.getItem('cart')) || [
  { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryOptionId: '1' },
  { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1, deliveryOptionId: '2' }
];

// ---------------- ADD TO CART ----------------
export function addToCart(productId, quantity) {
  let matchingItem = cart.find(item => item.productId === productId);
  if (matchingItem) matchingItem.quantity += quantity;
  else cart.push({ productId, quantity, deliveryOptionId: '1' });
  saveToStorage();
}

// ---------------- REMOVE FROM CART ----------------
export function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveToStorage();
}

// ---------------- UPDATE DELIVERY OPTION ----------------
export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find(item => item.productId === productId);
  if (matchingItem) matchingItem.deliveryOptionId = String(deliveryOptionId);
  saveToStorage();
}

// ---------------- STORAGE ----------------
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
