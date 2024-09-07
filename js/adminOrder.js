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
        dbOrders.push({ ...data[key], id: key });
      }
      orders = dbOrders;
      displayOrder();
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
                <p class="title">Table</p>
                <p class="title">${order.user}</p>
               
              
            </div>
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
    const itemContainer = document.getElementById(order.id);
    order.items.forEach((item) => {
      const itemHTML = `<p>${item.quantity} x ${item.name}`;
      itemContainer.insertAdjacentHTML("afterbegin", itemHTML);
    });

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
  });
}

//change status
const changeStatus = (orderId) => {
  let statusText = "";
  const index = orders.findIndex((order) => {
    return order.id === orderId;
  });
  statusText = orders[index].status;

  if (statusText !== "delivery") {
    if (statusText === "pending") {
      statusText = "cooking";
      orders[index].status = statusText;
      return updateOrder(orders[index]);
    }
    if (statusText === "cooking") {
      statusText = "delivery";
      orders[index].status = statusText;
      return updateOrder(orders[index]);
    }
  }
};

//Updating orders status
async function updateOrder(order) {
  console.log("clicked");
  let button = document.getElementById(order.id + "-btn");
  fetch(
    `https://restaurantapp-57420-default-rtdb.firebaseio.com/orders/${order.id}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(order),
    }
  )
    .then((response) => {
      console.log(response);
      if (response.ok) {
        button.innerHTML = order.status;

        if (order.status === "pending") {
          button.style.backgroundColor = "orange";
        }
        if (order.status === "cooking") {
          button.style.backgroundColor = "green";
        }
        if (order.status === "delivery") {
          button.style.backgroundColor = "tomato";
        }
      } else {
        alert("Error1");
      }
    })
    .catch((error) => {
      alert("error");
    });
}
