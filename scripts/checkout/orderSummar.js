import { cart, deleteCartItem, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { cartQuantity, removeFromCart } from "../utils/cartUtils.js";
import dayjs from "https://unpkg.com/dayjs@1.8.9/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/delivery.js";
import { OrderPaymentSummary } from "./paymentSummary.js";

const today = dayjs();
const deliveryTime = today.add(7, "days");
console.log(deliveryTime.format("dddd, MMMM, D"));

export function renderOrderSummary() {
  let cartSummaryHTML = ``;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();

    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

    const deliveryString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
    <div class="cart-item-container
      js-cart-container-${matchingProduct.id}">
            <div class="delivery-date">Delivery date: ${deliveryString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = ``;
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();

      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

      const deliveryString = deliveryDate.format("dddd, MMMM D");
      let priceCents = deliveryOption.priceCents;

      priceCents =
        deliveryOption.priceCents === 0
          ? "Free"
          : `$${formatCurrency(priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `<div class="delivery-option js-deliver-options"
    data-product-id = "${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
      <input
        
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">${deliveryString}</div>
        <div class="delivery-option-price">${priceCents}Shipping</div>
      </div>
    </div>`;
    });
    return html;
  }

  document.querySelector(".js-order-summar").innerHTML = cartSummaryHTML;
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      deleteCartItem(productId);

      const container = document.querySelector(
        `.js-cart-container-${productId}`
      );
      container.remove();
      renderOrderSummary();
      OrderPaymentSummary();
    });
  });

  document.querySelectorAll(".remove-from-cart-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      removeFromCart(productId);
    });
  });

  document.querySelectorAll(".js-deliver-options").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      OrderPaymentSummary();
    });
  });

  cartQuantity();
}
