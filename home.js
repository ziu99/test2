//? GET : lấy danh sách , lấy chi tiếc
//? POST: tạo mới
//? PUSH : Thêm
//? DELETE: xoá

var idEditTed = null;

// ? bật loading
function turnOnLoading() {
  document.getElementById("loading").style.display = "block";
}

// ? ẩn loading
function turnOffLoading() {
  document.getElementById("loading").style.display = "none";
}
// ! render
function renderPhone(phoneArr) {
  var contentHTML = "";
  // ? hàm reverse giúp đảo ngược array (1,2,3=>3,2,1)
  var reversePhoneArr = phoneArr.reverse();
  // ? render product
  reversePhoneArr.forEach(function (item, index) {
    var trString = `
    <tr>
    <td>${index + 1}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>
    <td><img width=100 src="${item.img}" alt=""></td>
    <td>${item.screen}</td>
    <td>${item.backCamera}</td>
    <td>${item.frontCamera}</td>
    <td>${item.desc}</td>
    <td>
        <button onclick="buyPhone('${
          item.id
        }')" class="btn btn-success">Mua</button>
    </td>
    </tr>
    `;
    contentHTML += trString;
  });
  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}
function fetchPhone() {
  turnOnLoading();
  axios({
    url: "https://65a5f6b274cf4207b4ef0ee4.mockapi.io/QLSP",
    method: "GET",
  })
    .then(function (res) {
      console.log("res", res);
      turnOffLoading();
      renderPhone(res.data);
    })
    .catch(function (err) {
      console.log("error", err);
      turnOffLoading();
    });
}
fetchPhone();



// ! hàm dropdown
function filterPhone() {
  var filterSelect = document.getElementById("filterPhone");
  var selectedType = filterSelect.value;

  if (selectedType === "all") {
      fetchPhone(); // Nếu chọn "Tất cả sản phẩm", hiển thị toàn bộ danh sách
  } else {
      // Nếu chọn một loại cụ thể, lọc danh sách sản phẩm theo loại
      turnOnLoading();
      axios({
          url: "https://65a5f6b274cf4207b4ef0ee4.mockapi.io/QLSP",
          method: "GET",
      })
          .then(function (res) {
              turnOffLoading();
              var filterPhone = res.data.filter(function (product) {
                  return product.type === selectedType;
              });
              renderPhone(filterPhone);
          })
          .catch(function (err) {
              turnOffLoading();
              console.log("error", err);
          });
  }
}



// ! Giỏ hàng
// Khai báo biến

var cart = [];

// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    var existingItem = cart.find(function (item) {
        return item.product.id === product.id;
    });

    if (existingItem) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
        existingItem.quantity++;
    } else {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm vào giỏ hàng với số lượng là 1
        var newItem = {
            product: product,
            quantity: 1,
        };
        cart.push(newItem);
    }

    // Hiển thị thông tin giỏ hàng
    displayCartInfo();
}

// Hàm để hiển thị thông tin giỏ hàng
function displayCartInfo() {
    var cartInfo = document.getElementById("cartInfo");
    var totalItems = 0;

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    cart.forEach(function (item) {
        totalItems += item.quantity;
    });

    // Hiển thị thông tin giỏ hàng
    cartInfo.innerHTML = "Giỏ hàng (" + totalItems + " sản phẩm)";
}

// Hàm khi người dùng bấm nút "Mua"
function buyPhone(productId) {
    // Tìm sản phẩm theo productId
    var selectedProduct = null;
    axios({
        url: "https://65a5f6b274cf4207b4ef0ee4.mockapi.io/QLSP/" + productId,
        method: "GET",
    })
        .then(function (res) {
            selectedProduct = res.data;

            // Thêm sản phẩm vào giỏ hàng
            addToCart(selectedProduct);
        })
        .catch(function (err) {
            console.log("error", err);
        });
}



