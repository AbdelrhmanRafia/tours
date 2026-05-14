import { login, logout, signup } from "./login";
import { displayMap } from "./mapbox";
import { updateData } from "./updateSettings";
import { bookTour } from "./stripe";
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".van__el--logout");
const updateDataForm = document.querySelector(".form-user-data");
const updatePasswordForm = document.querySelector(".form-user-password");
const signUpForm = document.querySelector(".form--signup");
const bookBtn = document.getElementById("book-tour");
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}
if (signUpForm) {
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name-signup").value;
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("password-signup").value;
    const passwordConfirm = document.getElementById(
      "passwordConfirm-signup",
    ).value;

    signup({ name, email, password, passwordConfirm });
  });
}
if (logOutBtn) logOutBtn.addEventListener("click", logout);

if (updateDataForm) {
  updateDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const photo = document.querySelector(".form__upload").files[0];

    // const form = new FormData();
    // form.append("name", name);
    // form.append("email", email);
    // form.append("photo", photo);

    updateData({ name, email, photo }, "data");
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password-new").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    updateData({ currentPassword, password, passwordConfirm }, "password");
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
