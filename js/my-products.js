import API_CONFIG from "./config.js"

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")
  const productList = document.getElementById("product-list")
  const modal = document.getElementById("edit-product-modal")
  const closeModalBtn = document.getElementById("close-modal")
  const cancelEditBtn = document.getElementById("cancel-edit")
  const editForm = document.getElementById("edit-product-form")
  let currentProductId = null

  if (!token) {
    alert("Zəhmət olmasa əvvəlcə giriş edin!")
    window.location.href = "login.html"
    return
  }

  closeModalBtn.addEventListener("click", closeModal)
  cancelEditBtn.addEventListener("click", closeModal)

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })

  function closeModal() {
    modal.style.display = "none"
  }

  console.log("Fetching products...")
  fetch(`${API_CONFIG.BASE_URL}/user/products/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Products fetch failed")
      }
      return response.json()
    })
    .then((data) => {
      if (data.length === 0) {
        productList.innerHTML = '<div class="text-center">You have not added any products yet.</div>'
      } else {
        data.forEach((product) => {
          const productItem = document.createElement("div")
          productItem.classList.add("product-item")

          let additionalInfo = ""
          if (product.category === "PC" || product.category === "Laptop") {
            additionalInfo = `
                  <div class="product-specs">
                      <p><strong>CPU:</strong> ${product.cpu || "N/A"}</p>
                      <p><strong>RAM:</strong> ${product.ram || "N/A"}</p>
                      <p><strong>GPU:</strong> ${product.gpu || "N/A"}</p>
                      <p><strong>Storage:</strong> ${product.storage || "N/A"}</p>
                  </div>
              `
          }

          productItem.innerHTML = `
              <div class="product-image-container">
                  <img src="${product.photo}" alt="${product.brand}">
              </div>
              <div class="product-content">
                  <div class="product-header">
                      <h3 class="product-title">${product.brand}</h3>
                      <span class="product-category">${product.category}</span>
                  </div>
                  <div class="product-price">${product.price_with_currency}</div>
                  <p class="product-description">${product.description}</p>
                  ${additionalInfo}
                  <div class="product-actions">
                      <button class="btn" onclick="openEditModal(${product.id})">Edit</button>
                      <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                  </div>
              </div>
          `

          productList.appendChild(productItem)
        })
      }
    })
    .catch((error) => {
      console.error("Error while fetching products:", error)
      productList.innerHTML = '<div class="message message-error">Error loading products. Please try again later.</div>'
    })

  window.openEditModal = (productId) => {
    currentProductId = productId

    fetch(`${API_CONFIG.BASE_URL}/user/products/${productId}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("edit-price").value = product.price
        document.getElementById("edit-description").value = product.description

        modal.style.display = "flex"
      })
      .catch((error) => {
        console.error("Error fetching product details:", error)
      })
  }

  window.deleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      fetch(`${API_CONFIG.BASE_URL}/user/products/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            location.reload()
          } else {
            throw new Error("Failed to delete product")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Error deleting product")
        })
    }
  }

  editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("price", document.getElementById("edit-price").value)
    formData.append("description", document.getElementById("edit-description").value)

    const photoInput = document.getElementById("edit-photo")
    if (photoInput.files.length > 0) {
      formData.append("photo", photoInput.files[0])
    }

    fetch(`${API_CONFIG.BASE_URL}/user/products/${currentProductId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update product")
        }
        return response.json()
      })
      .then((data) => {
        closeModal()
        location.reload()
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("Error updating product")
      })
  })
})

