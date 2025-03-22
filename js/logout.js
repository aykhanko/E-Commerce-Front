import API_CONFIG from "./config.js"

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-btn")
  const loginLink = document.querySelector("a[href='login.html']")
  const registerLink = document.querySelector("a[href='register.html']")
  const token = localStorage.getItem("token")

  if (token) {
    logoutButton.style.display = "inline-block"
    if (loginLink) loginLink.style.display = "none"
    if (registerLink) registerLink.style.display = "none"
  } else {
    logoutButton.style.display = "none"
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      fetch(`${API_CONFIG.BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            localStorage.removeItem("token")
            window.location.href = "login.html"
          } else {
            alert("Çıxış zamanı xəta baş verdi!")
          }
        })
        .catch((error) => console.error("Xəta:", error))
    })
  }
})

