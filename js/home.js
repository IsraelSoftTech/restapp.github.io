// let products = [
//     {
//         id:101,
//         name: "rice",
//         image: "../img/food5.jpg",
//         stock: 4,
//         cookTime: 10,
//         price: 1000,
//     },
//     {
//         id:102,
//         name: "beans",
//         image: "../img/food4.jpg",
//         stock: 3,
//         cookTime: 12,
//         price: 1200,
//     },
//     {
//         id:103,
//         name: "cokie",
//         image: "../img/food1.jpg",
//         stock: 5,
//         cookTime: 13,
//         price: 1100,
//     },
//     {
//         id:104,
//         name: "beans",
//         image: "../img/food4.jpg",
//         stock: 6,
//         cookTime: 20,
//         price: 1600,
//     },
//     {
//         id:105,
//         name: "salad",
//         image: "../img/food1.jpg",
//         stock: 9,
//         cookTime: 14,
//         price: 1700,
//     },
//     {
//         id:106,
//         name: "ndole",
//         image: "../img/food2.jpg",
//         stock: 1,
//         cookTime: 8,
//         price: 900,
//     },
//     {
//         id:107,
//         name: "achu",
//         image: "../img/food5.jpg",
//         stock: 12,
//         cookTime: 16,
//         price: 700,
//     },
//     {
//         id:108,
//         name: "garri",
//         image: "../img/food4.jpg",
//         stock: 7,
//         cookTime: 6,
//         price: 600,
//     },
// ];

let products = [];
let cart = [];

let editProductId;
//get id
const id= localStorage.getItem("id");
if(!id) {
  localStorage.setItem("id", "table"+Date.now()); 
}
//Get Products from DB
function getProductsFromDb() {
  fetch("https://restaurantapp-57420-default-rtdb.firebaseio.com/Products.json")
    .then((response) => response.json())

    .then((data) => {
      console.log(data);
      let dbProducts = [];
      for (const key in data) {
        dbProducts.push({ ...data[key], id: key });
      }
      products = dbProducts;

      for (let item of products) {
        const product = ` <div class="product-container">
                     
                      <div class="product-img">
                        <img src="${item.image}">
                        <h4>${item.name}</h4>
                        <h5>stock:${item.stock}</h5>
                        <div class="clock-span">
                            <img src="../img/clock.png" alt=""/><span>${item.cookTime}min</span>
                        </div>
                        <p>${item.price}FCFA</p>
                        <div class="cartIcon">
                            <img src="../img/cart.png" alt="" style="width: 40px; height: 40px; cursor:pointer;" onClick="addToCart('${item.id}')">
                        </div>
                    </div>
                </div>`;
        const productDiv = document.getElementById("products_container");
        productDiv.insertAdjacentHTML("afterbegin", product);
      }
    })
    .catch((error) => {});
}

getProductsFromDb();

// function get cart
function getCartFromDb() {
  const items = JSON.parse(localStorage.getItem("cart"));
  if (items) {
    cart = items;
  }
  document.getElementById("count").innerHTML = cart.length;
}
getCartFromDb();

//Add to cart
function addToCart(productId) {
  const product = products.find((product) => {
    return product.id === productId;
  });

  const existingCartItem = cart.find((cartItem) => {
    return cartItem.productId === productId;
  });
  if (existingCartItem) {
    return alert("Already added to cart");
  }

  const cartItem = {
    productId: product.id,
    price: product.price,
    image: product.image,
    name: product.name,
    quantity: 1,
    user: "John Smith",
  };
  cart.push(cartItem);
  document.getElementById("count").innerHTML = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

//Search Bar
// document.getElementById("searchInput").addEventListener("input", function () {
//   const searchValue = this.ariaValueMax.toLocaleLowerCase();
  //Get the value and convert it to lower case

//   const products = documents.querySelectorAll(
//     "#products_container .product-img"
//   );
  //Select all products dv

//   products.forEach(function (product) {
//     const productName = product.querySelector("h4").textContent.toLowerCase();
    //Get the product name in lower case

//     if (productName.startsWith(searchValue)) {
//       product.style.display = "";
      //Show product
//     } else {
//       product.style.display = "none";
      //else hide product
//     }
//   });
// });




//Search Bar
document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  //Get the value and convert it to lower case

  const products = document.querySelectorAll(
    "#products_container .product-img"
  );
  //Select all products dv

  const searchMessage = document.getElementById("searchMessage");
  //show search message
  searchMessage.style.display = "block";

  //Show no match
  const result = document.getElementById("result");

  //Hide product immediately
  products.forEach(function (product) {
    product.style.display = "none";
  });
  //set timeout
  setTimeout(function () {
    //Hide search message
    searchMessage.style.display = "none";

    //Filter and display products

    products.forEach(function (product) {
      const productName = product.querySelector("h4").textContent.toLowerCase();
      //Get the product name in lower case

      if (productName.includes(searchValue)) {
        product.style.display = "block";

        //Show product
      } else {
        product.style.display = "none";

        //else hide product
      }

      if (product.style.display == "none") {
        result.style.display = "block";

        setTimeout(function () {
          //Hide search message
          result.style.display = "none";
        }, 1000);
      } else {
        result.style.display = "none";
        setTimeout(function () {
          //Hide search message
          result.style.display = "none";
        }, 0);
      }
    });
  }, 1000); //1000 milliseconds
});
