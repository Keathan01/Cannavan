// ===== AUTH LOGIC =====
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

function showSignup() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
}

function showLogin() {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}

function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const email = document.getElementById("signup-email").value;

  if (!username || !password || !email) {
    alert("All fields required!");
    return;
  }

  if (users.find((u) => u.username === username)) {
    alert("User already exists!");
    return;
  }

  const newUser = { username, password, email, profile: {} };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please login.");
  showLogin();
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
    loadProfile();
  } else {
    alert("Invalid credentials");
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("app-section").style.display = "none";
}

// ===== PROFILE LOGIC =====
function saveProfile() {
  if (!currentUser) return;

  currentUser.profile = {
    name: document.getElementById("profile-name").value,
    id: document.getElementById("profile-id").value,
    dob: document.getElementById("profile-dob").value,
    email: document.getElementById("profile-email").value,
  };

  const index = users.findIndex((u) => u.username === currentUser.username);
  users[index] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  alert("Profile updated!");
}

function loadProfile() {
  if (!currentUser) return;

  document.getElementById("profile-name").value =
    currentUser.profile.name || "";
  document.getElementById("profile-id").value = currentUser.profile.id || "";
  document.getElementById("profile-dob").value = currentUser.profile.dob || "";
  document.getElementById("profile-email").value =
    currentUser.profile.email || "";
}

// ===== MODAL LOGIC =====
function openModal(title, price) {
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-price").innerText = price;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Auto-login if user is saved
window.onload = function () {
  const savedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (savedUser) {
    currentUser = savedUser;
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
    loadProfile();
  }
};
