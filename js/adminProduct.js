//Products variable
// let products = [
//   {
//     id: 101,
//     name: "rice",
//     image: "../img/food5.jpg",
//     stock: 4,
//     cookTime: 10,
//     price: 1000,
//   },
//   {
//     id: 102,
//     name: "beans",
//     image: "../img/food4.jpg",
//     stock: 3,
//     cookTime: 12,
//     price: 1200,
//   },
//   {
//     id: 103,
//     name: "cokie",
//     image: "../img/food1.jpg",
//     stock: 5,
//     cookTime: 13,
//     price: 1100,
//   },
//   {
//     id: 104,
//     name: "beans",
//     image: "../img/food4.jpg",
//     stock: 6,
//     cookTime: 20,
//     price: 1600,
//   },
//   {
//     id: 105,
//     name: "salad",
//     image: "../img/food1.jpg",
//     stock: 9,
//     cookTime: 14,
//     price: 1700,
//   },
//   {
//     id: 106,
//     name: "ndole",
//     image: "../img/food2.jpg",
//     stock: 1,
//     cookTime: 8,
//     price: 900,
//   },
//   {
//     id: 107,
//     name: "achu",
//     image: "../img/food5.jpg",
//     stock: 12,
//     cookTime: 16,
//     price: 700,
//   },
//   {
//     id: 108,
//     name: "garri",
//     image: "../img/food4.jpg",
//     stock: 7,
//     cookTime: 6,
//     price: 600,
//   },
// ];

//Local Storage
// localStorage.setItem("products", JSON.stringify(products));

let products = [];
let editProductId;
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
      displayProducts(dbProducts)

    })
    .catch((error) => {});
}



getProductsFromDb();

//display products
function displayProducts(productsItems) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  for (let item of productsItems) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `<td><img src="${item.image}" alt="" class="productImage"></td>
                    <td>${item.name}</td>
                    <td>${item.price}FCFA</td>
                    <td>${item.stock}</td>
                     <td>${item.cookTime}mins</td>
                    <td>
                    <div class="action" style="display:flex; gap: 0.7rem">
                    <div class="edit" style="color:blue; cursor:pointer" onClick="showEdit('${item.id}')">Edit</div>
                     <div class="delete" style="color:red; cursor:pointer;" onClick="deleteProduct('${item.id}')">Del</div>
                     </div>
                    </td>`;
    tableBody.appendChild(tableRow);

    localStorage.setItem("products", JSON.stringify(productsItems));
  }
}
displayProducts(products);

//Display and close Reg Form
function displayForm() {
  const containerRight = document.getElementById("containerRight");
  const openBtn = document.getElementById("openBtn");

  if (containerRight.style.display === "none") {
    openBtn.innerHTML = "Close";
    containerRight.style.display = "block";
    openBtn.style.backgroundColor = "red";
  } else {
    containerRight.style.display = "none";
    openBtn.innerHTML = "Open";
    openBtn.style.backgroundColor = "green";
  }
}

//Save Products
function saveProduct() {
  const image = document.getElementById("image");
  const price = document.getElementById("price");
  const name = document.getElementById("name");
  const stock = document.getElementById("stock");
  const cookTime = document.getElementById("cookTime");

  if (
    image.value === "" ||
    price.value === "" ||
    name.value === "" ||
    stock.value === "" ||
    cookTime.value === ""
  ) {
    alert("Fill all fields");
    return;
  }
  const newProduct = {
    id: Date.now(),
    name: name.value,
    image: image.value,
    stock: stock.value,
    cookTime: cookTime.value,
    price: price.value,
  };

  //send products to Database
  fetch("https://restaurantapp-57420-default-rtdb.firebaseio.com/Products.json", {
    method: "POST",
    body: JSON.stringify(newProduct),
  })
    .then((response) => {
      console.log(response);
      //check if it is a success
      if (response.ok) {
        //add products
        products.push(newProduct);
        displayProducts(products);
        emptyForm();
        //Else
      } else {
        alert("Error one");
      }
    })
    .catch((error) => {
      alert("Ooops,error");
    });
}

//Delete products
function deleteProduct(productId) {
  //Delete product from Database
  fetch(`https://restaurantapp-57420-default-rtdb.firebaseio.com/Products/${productId}.json`, {
    method: "DELETE",
  })
    .then((response) => {
      console.log(response);
      //check if it is a success
      if (response.ok) {
        const updatedProducts = products.filter((product) => {
          return product.id !== productId;
        });
        console.log(updatedProducts);
        products = updatedProducts;
        displayProducts(updatedProducts);

        //Else
      } else {
        alert("Error one");
      }
    })
    .catch((error) => {
      alert("Ooops,error");
    });
}

//Show Edit on Form
function showEdit(productId) {
  editProductId = productId;
  const product = products.find((product) => {
    return product.id === productId;
  });
  console.log(product);
  document.getElementById("containerRight").style.display = "block";
  document.getElementById("image").value = product.image;
  document.getElementById("name").value = product.name;
  document.getElementById("stock").value = product.stock;
  document.getElementById("price").value = product.price;
  document.getElementById("cookTime").value = product.cookTime;

  document.getElementById("editBtn").style.display = "block";
  document.getElementById("saveBtn").style.display = "none";
}
//Empty Form
function emptyForm() {
  document.getElementById("image").value = "";
  document.getElementById("name").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("price").value = "";
  document.getElementById("cookTime").value = "";
}
//Reset Form
function resetForm() {
  document.getElementById("editBtn").style.display = "none";
  document.getElementById("saveBtn").style.display = "block";

  emptyForm();
}

//Edit Products
function editProduct() {
  //Getting Form data
  const image = document.getElementById("image").value;
  const price = document.getElementById("price").value;
  const name = document.getElementById("name").value;
  const stock = document.getElementById("stock").value;
  const cookTime = document.getElementById("cookTime").value;

  //check if
  if (
    image === "" ||
    price === "" ||
    name === "" ||
    stock === "" ||
    cookTime === ""
  ) {
    alert("Fill all fields");
    return;
  }

  //Edit Product in the database
  fetch(`https://restaurantapp-57420-default-rtdb.firebaseio.com/Products/${editProductId}.json`, {
    method: "PATCH",
    body: JSON.stringify({
      name: name,
      image: image,
      price: price,
      stock: stock,
      cookTime: cookTime,
    }),
  })
    .then((response) => {
      console.log(response);
      //check if it is a success
      if (response.ok) {
        //Finding Product Index
        const index = products.findIndex((product) => {
          return product.id === editProductId;
        });

        //Replacing elements with new form data
        products[index].image = image;
        products[index].price = price;
        products[index].name = name;
        products[index].stock = stock;
        products[index].cookTime = cookTime;

        //Display Products
        displayProducts(products);
        //Empty Form
        emptyForm();
        editProductId = "";
      } else {
        alert("Error one");
      }
    })
    .catch((error) => {
      alert("Ooops,error");
    });
}

//Go to excel
document.getElementById("openExcelBtn").addEventListener("click", function(){
  const excelFileUrl = 'http://localhost/LOSTFREE DBMS.xlsm';
  window.open(excelFileUrl, '_blank');

});