//get id
const id= localStorage.getItem("id");
if(!id) {
  localStorage.setItem("id", "table"+Date.now()); 
}
// Orders Array
let orders = [];
// function get cart
let cart = [];
//Price Variable
let totalPrice = 0;
//Get Cart from DB
function getCartFromDb() {
  const items = JSON.parse(localStorage.getItem("cart"));
  if (items) {
    cart = items;
  }
  document.getElementById("count").innerHTML = cart.length;
}
getCartFromDb();


//Get orders from DB
function getOrdersFromDb() {
  fetch("https://restaurantapp-57420-default-rtdb.firebaseio.com/orders.json")
    .then((response) => response.json())

    .then((data) => {
      console.log(data);
      let dbOrders = [];
      for (const key in data) {
        dbOrders.push({ ...data[key], id: key });
      }
      orders = dbOrders;
      displayCartItem(dbOrders)

    })
    .catch((error) => {});
}


getOrdersFromDb();
//Display Cart Items
function displayCartItem() {
  const cartContent = document.getElementById("cartContent");
  cartContent.innerHTML = "";
  cart.forEach((cartItem) => {
    const cartHtml = `<div class="cart-left">
<p>${cartItem.quantity}</p>
<img src="${cartItem.image}" />
<p>${cartItem.name}</p>
<h4>${cartItem.price}FCFA</h4>
<div class="plus-minus">
<p style="font-size: 30px; font-weight: 500; color:red; cursor: 
pointer;" onClick = "subtractItemQuantity('${cartItem.productId}')">-</p>
<p style="font-size: 30px; font-weight: 500;color:purple; cursor: 
pointer;" onClick = "addItemQuantity('${cartItem.productId}')">+</p>
</div>
</div>`;
    cartContent.insertAdjacentHTML("afterbegin", cartHtml);
  });
  //Calculate total price and item count
  calculateCartSummary();
  document.getElementById("count").innerHTML = cart.length;
  // Display order button condition
  if (cart.length < 1) {
    document.getElementById("orderBtn").style.display = "none";
  } else {
    document.getElementById("orderBtn").style.display = "bolck";
  }
  // totalPrice = 0;
}
displayCartItem();
//Calculate Cart Summary
function calculateCartSummary() {
  totalPrice = 0;
  cart.forEach((cartItem) => {
    totalPrice = +totalPrice + +cartItem.price * +cartItem.quantity;
  });
  document.getElementById("totalPrice").innerHTML = totalPrice;
  document.getElementById("itemCount").innerHTML = cart.length;
}
//Plus Button
function addItemQuantity(productId) {
  const index = cart.findIndex((cartItem) => {
    return cartItem.productId === productId;
  });
  cart[index].quantity = +cart[index].quantity + 1;
  displayCartItem();
  calculateCartSummary();
  localStorage.setItem("cart", JSON.stringify(cart));
}
//Minus Button
function subtractItemQuantity(productId) {
  const index = cart.findIndex((cartItem) => {
    return cartItem.productId === productId;
  });
  if (+cart[index].quantity > 1) {
    cart[index].quantity = +cart[index].quantity - 1;
    displayCartItem();
    calculateCartSummary();
  } else {
    removeItemFromCart(productId);
  }
}
//Remove Item from Cart
function removeItemFromCart(productId) {
  const updatedCart = cart.filter((cartItem) => {
    return cartItem.productId !== productId;
  });
  cart = updatedCart;
  displayCartItem();
  calculateCartSummary();
  localStorage.setItem("cart", JSON.stringify(cart));
}
//Order button
function order() {
  // console.log("Order button");
  let order = {
    // id: Date.now(),
    items: cart,
    totalPrice: totalPrice,
    user: id,
    status: "pending",
  };
 

//add orders to db
fetch("https://restaurantapp-57420-default-rtdb.firebaseio.com/orders.json", {
  method: "POST",
  body: JSON.stringify(order),
})
  .then((response) => {
    console.log(response);
    //check if it is a success
    if (response.ok) {
      //add products
    cart=[];
    orders.push(order);
    displayCartItem();
    calculateCartSummary();
    localStorage.setItem("cart", JSON.stringify(cart));
    
      //Else
    } else {
      alert("Error one");
    }
  })
  .catch((error) => {
    alert("Ooops,error");
  });
}