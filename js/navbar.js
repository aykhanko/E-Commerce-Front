document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")
  const profileLink = document.getElementById("profile-link")
  const myProductsLink = document.getElementById("my-products-link")
  const addProductLink = document.getElementById("add-product-link")
  const logoutButton = document.getElementById("logout-btn")

  if (token) {
    addProductLink.style.display = "inline"
    profileLink.style.display = "inline"
    myProductsLink.style.display = "inline"
    logoutButton.style.display = "inline"
  } else {
    addProductLink.style.display = "inline"
    profileLink.style.display = "none"
    myProductsLink.style.display = "none"
    logoutButton.style.display = "none"
  }

  addProductLink.addEventListener("click", (e) => {
    if (!token) {
      e.preventDefault()
      alert("Məhsul əlavə etmək üçün giriş etməlisiniz!")
      window.location.href = "login.html"
    }
  })
})

