// scripts/utils/cartUtils.js
import * as CartModule from "../../data/cart.js";

export function cartQuantity() {
  let cartQuantity = 0;

  CartModule.cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

export function removeFromCart(productId) {
  const productIndex = CartModule.cart.findIndex(
    (item) => item.productId === productId
  );

  if (productIndex > -1) {
    CartModule.cart.splice(productIndex, 1);
  }

  cartQuantity();
}
