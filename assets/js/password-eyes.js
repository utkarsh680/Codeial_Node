const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");
const showPasswordIcon = document.getElementById("show-password");
const showConfirmPasswordIcon = document.getElementById(
  "show-confirm-password"
);

showPasswordIcon.addEventListener("click", togglePasswordVisibility);
showConfirmPasswordIcon.addEventListener(
  "click",
  toggleConfirmPasswordVisibility
);

function togglePasswordVisibility() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showPasswordIcon.classList.remove("fa-eye");
    showPasswordIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    showPasswordIcon.classList.remove("fa-eye-slash");
    showPasswordIcon.classList.add("fa-eye");
  }
}

function toggleConfirmPasswordVisibility() {
  if (confirmInput.type === "password") {
    confirmInput.type = "text";
    showConfirmPasswordIcon.classList.remove("fa-eye");
    showConfirmPasswordIcon.classList.add("fa-eye-slash");
  } else {
    confirmInput.type = "password";
    showConfirmPasswordIcon.classList.remove("fa-eye-slash");
    showConfirmPasswordIcon.classList.add("fa-eye");
  }
}
