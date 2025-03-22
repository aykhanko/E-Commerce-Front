import API_CONFIG from "./config.js"

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("Zəhmət olmasa əvvəlcə giriş edin!")
    window.location.href = "login.html"
    return
  }

  const categorySelect = document.getElementById("category")
  const cpuField = document.getElementById("cpu").parentElement
  const gpuField = document.getElementById("gpu").parentElement
  const ramField = document.getElementById("ram").parentElement
  const storageField = document.getElementById("storage").parentElement

  function updateFields() {
    const selectedCategory = categorySelect.value

    if (["RAM", "CPU", "GPU", "Storage"].includes(selectedCategory)) {
      cpuField.style.display = "none"
      gpuField.style.display = "none"
      ramField.style.display = "none"
      storageField.style.display = "none"
    } else {
      cpuField.style.display = "block"
      gpuField.style.display = "block"
      ramField.style.display = "block"
      storageField.style.display = "block"
    }
  }

  categorySelect.addEventListener("change", updateFields)
  updateFields()

  const form = document.getElementById("add-product-form")
  form.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append("category", document.getElementById("category").value)
    formData.append("brand", document.getElementById("brand").value)
    formData.append("price", document.getElementById("price").value)
    formData.append("description", document.getElementById("description").value)

    const photoInput = document.getElementById("photo")
    if (photoInput.files.length > 0) {
      formData.append("photo", photoInput.files[0])
    } else {
      alert("Şəkil seçin!")
      return
    }

    if (!["RAM", "CPU", "GPU", "Storage"].includes(formData.get("category"))) {
      formData.append("cpu", document.getElementById("cpu").value)
      formData.append("gpu", document.getElementById("gpu").value)
      formData.append("ram", document.getElementById("ram").value)
      formData.append("storage", document.getElementById("storage").value)
    }

    fetch(`${API_CONFIG.BASE_URL}s/products/add/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          document.getElementById("message").innerText = "Məhsul uğurla əlavə edildi!"
          form.reset()
          updateFields()
        } else {
          document.getElementById("message").innerText = "Xəta: " + JSON.stringify(data)
        }
      })
      .catch((error) => console.error("Xəta:", error))
  })
})

