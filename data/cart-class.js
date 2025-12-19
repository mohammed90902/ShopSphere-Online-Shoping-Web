class Cart {
  items = [];
#localStorage;

  constructor(storageKey) {
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.items = JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  saveToStorage() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.items)
    );
  }

  addToCart(productId, quantity) {
    const item = this.items.find(
      item => item.productId === productId
    );

    if (item) {
      item.quantity += quantity;
    } else {
      this.items.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  removeFromCart(productId) {
    this.items = this.items.filter(
      item => item.productId !== productId
    );
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    const item = this.items.find(
      item => item.productId === productId
    );

    if (item) {
      item.deliveryOptionId = String(deliveryOptionId);
      this.saveToStorage();
    }
  }
}
