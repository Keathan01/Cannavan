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

// Signup
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

// Login
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
  if (index >= 0) {
    users[index] = currentUser;
  }
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

// SIMULATED ORDER & DRIVER TRACKING
function simulateOrder() {
  const status = document.getElementById("order-status");
  status.innerText = "🚚 Your order is on the way!";
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    status.innerText = `🚚 Driver is ${progress}% of the way`;
    if (progress >= 100) {
      clearInterval(interval);
      status.innerText = "✅ Order delivered!";
    }
  }, 1000);
}
