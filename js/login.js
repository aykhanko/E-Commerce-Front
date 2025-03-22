import API_CONFIG from "./config.js"

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  fetch(`${API_CONFIG.BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
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
      localStorage.setItem("token", data.key)
      localStorage.setItem("username", username)
      window.location.href = "profile.html"
    })
    .catch((error) => {
      console.error("Xəta:", error)
      alert("Xəta baş verdi: " + JSON.stringify(error))
    })
})

