function switchForm(formId) {
  document.querySelectorAll(".form").forEach((f) => f.classList.add("hidden"));
  document.getElementById(formId).classList.remove("hidden");
}
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;
let cart = [];

// MAPBOX
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [28.0473, -26.2041],
  zoom: 12,
});
const driverMarker = new mapboxgl.Marker({ color: "green" })
  .setLngLat([28.0473, -26.2041])
  .addTo(map);

// SIGNUP
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }
  if (users.some((u) => u.username === username)) {
    alert("Username taken");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const user = {
      fullName: document.getElementById("fullName").value,
      idNumber: document.getElementById("idNumber").value,
      dob: document.getElementById("dob").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      username,
      password,
      pic: reader.result,
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful!");
    switchForm("loginForm");
  };
  const file = document.getElementById("profilePic").files[0];
  if (file) reader.readAsDataURL(file);
  else reader.onload();
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    currentUser = user;
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("app-section").classList.remove("hidden");
    loadProfile();
    renderCart();
  } else alert("Invalid credentials");
});

function loadProfile() {
  document.getElementById("user-name").innerText = currentUser.fullName;
  document.getElementById("profile-img").src = currentUser.pic || "";
  document.getElementById("edit-fullName").value = currentUser.fullName;
  document.getElementById("edit-idNumber").value = currentUser.idNumber;
  document.getElementById("edit-dob").value = currentUser.dob;
  document.getElementById("edit-email").value = currentUser.email;
  document.getElementById("edit-address").value = currentUser.address;
}

function saveProfile() {
  currentUser.fullName = document.getElementById("edit-fullName").value;
  currentUser.idNumber = document.getElementById("edit-idNumber").value;
  currentUser.dob = document.getElementById("edit-dob").value;
  currentUser.email = document.getElementById("edit-email").value;
  currentUser.address = document.getElementById("edit-address").value;
  const file = document.getElementById("edit-pic").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      currentUser.pic = reader.result;
      updateStorage();
      loadProfile();
      alert("Profile updated!");
    };
    reader.readAsDataURL(file);
  } else {
    updateStorage();
    loadProfile();
    alert("Profile updated!");
  }
}

function updateStorage() {
  const index = users.findIndex((u) => u.username === currentUser.username);
  if (index >= 0) users[index] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
}

function logout() {
  currentUser = null;
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("app-section").classList.add("hidden");
}

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
document
  .getElementById("profile-btn")
  .addEventListener("click", () => openModal("profile-modal"));

// ORDER & DRIVER TRACKING
function simulateOrder() {
  const status = document.getElementById("order-status");
  status.innerText = "🚚 Your order is on the way!";
  let route = [
    [28.0473, -26.2041],
    [28.048, -26.205],
    [28.05, -26.206],
    [28.053, -26.207],
    [28.057, -26.21],
  ];
  let step = 0;
  const interval = setInterval(() => {
    if (step < route.length) {
      driverMarker.setLngLat(route[step]);
      step++;
      status.innerText = `🚚 Driver is ${Math.floor(
        (step / route.length) * 100
      )}% of the way`;
    } else {
      clearInterval(interval);
      status.innerText = "✅ Order delivered!";
    }
  }, 1000);
}

// CART & PRODUCTS
function openProductModal(name, price) {
  document.getElementById("product-name").innerText = name;
  document.getElementById("product-price").innerText = price;
  document.getElementById("product-qty").value = 1;
  document.getElementById("product-total").innerText = price;
  openModal("product-modal");

  document.getElementById("product-qty").oninput = () => {
    const qty = parseInt(document.getElementById("product-qty").value);
    document.getElementById("product-total").innerText = price * qty;
  };
  document.getElementById("product-modal").dataset.currentPrice = price;
  document.getElementById("product-modal").dataset.currentName = name;
}

function addProductToCart() {
  const qty = parseInt(document.getElementById("product-qty").value);
  const price = parseInt(
    document.getElementById("product-modal").dataset.currentPrice
  );
  const name = document.getElementById("product-modal").dataset.currentName;
  for (let i = 0; i < qty; i++) cart.push({ name, price });
  renderCart();
  closeModal("product-modal");
}

function renderCart() {
  const cartSection = document.getElementById("cart-section");
  if (cart.length === 0) {
    cartSection.classList.add("hidden");
    return;
  }
  cartSection.classList.remove("hidden");
  let html = "<h3>🛒 Your Cart</h3>";
  let total = 0;
  cart.forEach((item) => {
    html += `<p>${item.name} - $${item.price}</p>`;
    total += item.price;
  });
  html += `<strong>Total: $${total}</strong>`;
  cartSection.innerHTML = html;
}
