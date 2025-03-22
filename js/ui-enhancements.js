// Preloader
document.addEventListener("DOMContentLoaded", () => {
  // Show preloader
  const preloader = document.querySelector(".preloader")

  if (preloader) {
    // Hide preloader after page loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hidden")
        setTimeout(() => {
          preloader.style.display = "none"
        }, 500)
      }, 500)
    })
  }

  // Scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementPosition < windowHeight - 50) {
        element.classList.add("visible")
      }
    })
  }

  // Run once on load
  setTimeout(animateOnScroll, 500)

  // Run on scroll
  window.addEventListener("scroll", animateOnScroll)

  // Lightbox functionality
  const setupLightbox = () => {
    const productImages = document.querySelectorAll(".product-image, .product-image-container img")
    const lightbox = document.querySelector(".lightbox")

    if (!lightbox || productImages.length === 0) return

    let currentImageIndex = 0
    const lightboxImage = lightbox.querySelector(".lightbox-image")

    productImages.forEach((image, index) => {
      image.style.cursor = "pointer"

      image.addEventListener("click", (e) => {
        e.preventDefault()
        currentImageIndex = index
        lightboxImage.src = image.src
        lightbox.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    })

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove("active")
      document.body.style.overflow = ""
    }

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox)

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox()
      }
    })

    // Navigation
    const prevBtn = lightbox.querySelector(".lightbox-prev")
    const nextBtn = lightbox.querySelector(".lightbox-next")

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length
        lightboxImage.src = productImages[currentImageIndex].src
      })

      nextBtn.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % productImages.length
        lightboxImage.src = productImages[currentImageIndex].src
      })
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return

      if (e.key === "Escape") {
        closeLightbox()
      } else if (e.key === "ArrowLeft" && prevBtn) {
        prevBtn.click()
      } else if (e.key === "ArrowRight" && nextBtn) {
        nextBtn.click()
      }
    })
  }

  setupLightbox()

  // Typewriter effect
  const setupTypewriter = () => {
    const typewriterElement = document.querySelector(".typewriter")
    if (!typewriterElement) return

    const text = typewriterElement.textContent
    typewriterElement.textContent = ""
    typewriterElement.style.visibility = "visible"

    let i = 0
    const typeSpeed = 100

    function type() {
      if (i < text.length) {
        typewriterElement.textContent += text.charAt(i)
        i++
        setTimeout(type, typeSpeed)
      }
    }

    setTimeout(type, 1000)
  }

  setupTypewriter()

  // Sticky navigation
  const setupStickyNav = () => {
    const nav = document.querySelector("nav")
    if (!nav) return

    const navTop = nav.offsetTop

    function stickyNav() {
      if (window.scrollY >= navTop) {
        document.body.classList.add("sticky-nav")
        nav.classList.add("sticky")
      } else {
        document.body.classList.remove("sticky-nav")
        nav.classList.remove("sticky")
      }
    }

    window.addEventListener("scroll", stickyNav)
  }

  setupStickyNav()

  // Add 3D tilt effect to cards
  const setupTiltEffect = () => {
    const cards = document.querySelectorAll(".product-card, .feature-card")

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      })
    })
  }

  // Only enable tilt on desktop
  if (window.innerWidth > 768) {
    setupTiltEffect()
  }
})

