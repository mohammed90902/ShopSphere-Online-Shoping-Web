export const cart=[]



export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach((Cartitem) => {
    if (Cartitem.productId === productId) {
      matchingItem = Cartitem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity
    });
  }
}