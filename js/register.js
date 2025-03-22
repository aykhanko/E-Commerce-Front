import API_CONFIG from "./config.js"

document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault()

  const username = document.getElementById("username").value
  const password1 = document.getElementById("password1").value
  const password2 = document.getElementById("password2").value

  const data = {
    username: username,
    password1: password1,
    password2: password2,
  }

  console.log("Göndərilən data:", data)

  fetch(`${API_CONFIG.BASE_URL}/auth/registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw err
        })
      }
      return response.json()
    })
    .then((data) => {
      console.log("Uğurlu qeydiyyat:", data)
      alert("Qeydiyyat uğurla tamamlandı!")
      window.location.href = "login.html"
    })
    .catch((error) => {
      console.error("Xəta:", error)
      alert("Xəta baş verdi: " + JSON.stringify(error))
    })
})

