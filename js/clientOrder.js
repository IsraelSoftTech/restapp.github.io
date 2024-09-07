const id = localStorage.getItem("id");
if (!id) {
  localStorage.setItem("id", "table" + Date.now());
}

setInterval(()=>{
  displayOrder()
}, 3000);

// Orders Array
let orders = [];

//Get orders from DB
function getOrdersFromDb() {
  fetch("https://restaurantapp-57420-default-rtdb.firebaseio.com/orders.json")
    .then((response) => response.json())

    .then((data) => {
      console.log(data);
      let dbOrders = [];
      for (const key in data) {
        const transformedItems = {
          ...data[key],
          id: key,
        };
        if (transformedItems.user === id) {
          dbOrders.push(transformedItems);
        }
      }
      orders = dbOrders;
    })
    .catch((error) => {});
}

getOrdersFromDb();

//Dispay order
function displayOrder() {
  const ordersContainer = document.getElementById("ordersContainer");
  ordersContainer.innerHTML = "";
  orders.forEach((order) => {
    const orderHTML = `<div class="orderItem" style="width:60%">
            <div class="">
                <p class="title">Products</p>
                <div id="${order.id}" class="">

                </div>
              
            </div>

            <div class="">
                <p class="title">Total Price</p>
                <p>${order.totalPrice}FCFA</p>
            </div>

            <div class="">
                <p class="title">Status</p>
                  <div class="status" onclick="changeStatus('${order.id}')" style="cursor:pointer" id= "${order.id}-btn">${order.status}</div>
            </div>
        </div>`;
    ordersContainer.insertAdjacentHTML("afterbegin", orderHTML);
    let button = document.getElementById(order.id + "-btn");
    if (order.status === "pending") {
      button.style.backgroundColor = "orange";
    }
    if (order.status === "cooking") {
      button.style.backgroundColor = "green";
    }
    if (order.status === "delivery") {
      button.style.backgroundColor = "tomato";
    }

    const itemContainer = document.getElementById(order.id);
    order.items.forEach((item) => {
      const itemHTML = `<p>${item.quantity} x ${item.name}`;
      itemContainer.insertAdjacentHTML("afterbegin", itemHTML);
    });
  });
}
displayOrder();
