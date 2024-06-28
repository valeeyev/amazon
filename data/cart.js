export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [];
}

export function addToCard(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  }
  saveToLocalStorage();
}

export function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function deleteCartItem(productId) {
  const newArray = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newArray.push(cartItem);
    }
  });
  cart = newArray;
  saveToLocalStorage();
}
