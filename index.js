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
  // Load cart info after load
  displayCartInfo();
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
function getCartInfo() {
  const cart = localStorage.getItem("cart");
  if (cart == "undefined" || cart == null) {
    return [];
  }

  return JSON.parse(cart);
}

function updateCartInfo(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  let cart = getCartInfo();

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
  console.log(cart);
  updateCartInfo(cart);
  // Hiển thị thông tin giỏ hàng
  displayCartInfo();
}

// Hàm để hiển thị thông tin giỏ hàng
function displayCartInfo() {
  var cartInfo = document.getElementById("cartInfo");
  var totalItems = 0;
  const cart = getCartInfo();
  // Tính tổng số lượng sản phẩm trong giỏ hàng
  cart.forEach(function (item) {
    totalItems += item.quantity;
  });

  // Hiển thị thông tin giỏ hàng
  cartInfo.innerHTML = " Giỏ hàng (" + totalItems + " sản phẩm)";
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

      // Hiển thị thông báo cho người dùng (nếu cần)
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    })
    .catch(function (err) {
      console.log("error", err);
    });
}

//! Hàm khi người dùng bấm nút "Giỏ hàng"
function cartInfo() {
  // Lấy thông tin từ giỏ hàng trong Local Storage
  var cart = getCartInfo();

  // Hiển thị thông tin sản phẩm trong modal
  var tableBody = document.getElementById("thanhToan"); //  tbody trong modal
  var totalCell = document.getElementById("tinhTong"); // hiển thị tổng thanh toán

  // Reset nội dung của tbody
  tableBody.innerHTML = "";

  // Duyệt qua từng sản phẩm trong giỏ hàng và cập nhật modal
  cart.forEach(function (item, index) {
    var tr = document.createElement("tr");

    // Cập nhật thông tin sản phẩm
    tr.innerHTML = `
        <tr>
            <td>${index + 1}</td>
            <td>${item.product.name}</td>
            <td>${item.product.price}</td>
            <td><img width="50" src="${item.product.img}" alt=""></td>
            <td>
            <button onclick="giamSL(${index})"> - </button>
            <span>${item.quantity}</span>
            <button onclick="tangSL(${index})"> + </button>
            </td>
        </tr>
        `;

    // Thêm dòng vào tbody
    tableBody.appendChild(tr);
  });

  // Tính tổng thanh toán
  var totalPayment = 0;
  cart.forEach(function (item) {
    totalPayment += item.product.price * item.quantity;
  });

  // Hiển thị tổng thanh toán
  totalCell.innerHTML = ` ${totalPayment} $`;
}

// Hàm tăng số lượng sản phẩm trong giỏ hàng
function tangSL(index) {
  var cart = getCartInfo();
  cart[index].quantity++;
  updateCartInfo(cart);
  cartInfo(); // Cập nhật lại thông tin trong modal
}

// Hàm giảm số lượng sản phẩm trong giỏ hàng
function giamSL(index) {
  var cart = getCartInfo();
  if (cart[index].quantity > 0) {
    cart[index].quantity--;
    updateCartInfo(cart);
    cartInfo(); // Cập nhật lại thông tin trong modal
  }
}

// Hàm xoá sản phẩm khỏi giỏ hàng
function removeCart(index) {
  var cart = getCartInfo();
  cart.splice(index, 1);
  updateCartInfo(cart);
  cartInfo(); // Cập nhật lại thông tin trong modal
  // Kiểm tra xem giỏ hàng có rỗng không
  if (cart.length === 0) {
    // Nếu giỏ hàng rỗng, thoát khỏi trang thanh toán
    //chuyển hướng về trang chủ:
    window.location.href = "index.html";
  }
}

// Hàm thanh toán

function addProduct() {
  // Hiển thị thông báo thanh toán thành công
  var thongBaoTT = document.getElementById("thongBaoTT");
  thongBaoTT.style.display = "block";

  // Làm sạch giỏ hàng trên giao diện người dùng
  var cart = [];

  cartInfo(); // Cập nhật lại thông tin trong modal
  
  // Lưu mảng giỏ hàng vào Local Storage với key là "cart"
  localStorage.setItem("cart", JSON.stringify(cart));

  // Hiển thị thông báo mua thành công và thoát ra
  alert("Đặt hàng thành công!");

  // chuyển hướng về trang chủ
  window.location.href = "index.html";
}
