import API_CONFIG from "./config.js"

document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1
  let totalPages = 1
  let currentCategory = "all"

  const paginationContainer = document.getElementById("pagination")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const pageInfo = document.getElementById("page-info")

  function loadProducts(page = 1, category = "all") {
    fetch(`${API_CONFIG.BASE_URL}/products/?page=${page}&category=${category}`, {
      headers: {
        Authorization: `Api-Key ${API_CONFIG.API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        showProducts(data.results)
        setupFilters()
        totalPages = Math.ceil(data.count / 12)
        currentPage = page
        updatePagination()

        window.scrollTo({ top: 0, behavior: "smooth" })
      })
      .catch((error) => console.error("Xəta:", error))
  }

  function showProducts(products) {
    const productList = document.getElementById("product-list")
    productList.innerHTML = ""

    if (products.length === 0) {
      productList.innerHTML = '<div class="text-center">No products found</div>'
      return
    }

    products.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"
      productCard.dataset.category = product.category

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

      productCard.innerHTML = `
        <img src="${product.photo_url || product.photo}" alt="${product.brand}" class="product-image">
        <div class="product-details">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.brand}</h3>
          <div class="product-price">${product.price_with_currency}</div>
          <p class="product-description">${product.description}</p>
          ${additionalInfo}
          <div class="product-seller">
            <p>Seller: ${product.user_profile.user}</p>
            <p>Contact: ${product.user_profile.phone || "N/A"}</p>
          </div>
        </div>
      `

      productList.appendChild(productCard)
    })
  }

  function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn")

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"))

        button.classList.add("active")

        currentCategory = button.dataset.category
        loadProducts(1, currentCategory)
      })
    })
  }

  function updatePagination() {
    paginationContainer.innerHTML = "" // Əvvəlki düymələri təmizlə

    // **Prev düyməsi**
    const prevButton = document.createElement("button")
    prevButton.textContent = "‹"
    prevButton.disabled = currentPage === 1
    prevButton.addEventListener("click", () => changePage(currentPage - 1))
    paginationContainer.appendChild(prevButton)

    // **Səhifə düymələrini yarat**
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        const pageBtn = document.createElement("button")
        pageBtn.textContent = i
        if (i === currentPage) pageBtn.classList.add("active")
        pageBtn.addEventListener("click", () => changePage(i))
        paginationContainer.appendChild(pageBtn)
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        const dots = document.createElement("span")
        dots.textContent = "..."
        paginationContainer.appendChild(dots)
      }
    }

    // **Next düyməsi**
    const nextButton = document.createElement("button")
    nextButton.textContent = "›"
    nextButton.disabled = currentPage === totalPages
    nextButton.addEventListener("click", () => changePage(currentPage + 1))
    paginationContainer.appendChild(nextButton)

    // **Səhifə məlumatını yenilə**
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`
  }

  function changePage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page
      loadProducts(currentPage, currentCategory)
      updatePagination()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  loadProducts(currentPage, currentCategory)
})

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    loadProducts(currentPage - 1, currentCategory)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
})

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    loadProducts(currentPage + 1, currentCategory)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
})

