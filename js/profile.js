import API_CONFIG from "./config.js"

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token")

  if (!token) {
    alert("Profil səhifəsinə baxmaq üçün giriş etməlisiniz!")
    window.location.href = "login.html"
    return
  }

  const username = localStorage.getItem("username")
  const profileUrl = `${API_CONFIG.BASE_URL}/profile/${username}/`

  // Set avatar with first letter of username
  function setAvatar(username) {
    const avatarElement = document.getElementById("profile-avatar")
    if (username && username.length > 0) {
      avatarElement.textContent = username.charAt(0).toUpperCase()
    } else {
      avatarElement.textContent = "U"
    }
  }

  fetch(profileUrl, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("username").innerText = data.user
      document.getElementById("phone").innerText = data.phone || "Təyin edilməyib"
      document.getElementById("email").innerText = data.mail || "Təyin edilməyib"
      document.getElementById("date_of_birth").innerText = data.date_of_birth || "Təyin edilməyib"

      setAvatar(data.user)
    })
    .catch((error) => {
      console.error("Xəta:", error)
      // Show error message
      const profileContainer = document.querySelector(".profile-container")
      profileContainer.innerHTML =
        '<div class="message message-error">Error loading profile data. Please try again later.</div>'
    })

  document.querySelectorAll(".editable").forEach((element) => {
    element.addEventListener("click", () => {
      let currentValue = element.innerText
      if (currentValue === "Təyin edilməyib") {
        currentValue = ""
      }

      const input = document.createElement("input")
      input.type = element.id === "date_of_birth" ? "date" : "text"
      input.value = currentValue
      input.className = "edit-input"

      input.addEventListener("blur", () => {
        element.innerText = input.value || "Təyin edilməyib"
      })

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          element.innerText = input.value || "Təyin edilməyib"
        }
      })

      element.innerHTML = ""
      element.appendChild(input)
      input.focus()
    })
  })

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.getAttribute("data-field")
      document.getElementById(field).innerText = "Təyin edilməyib"
    })
  })

  document.getElementById("update-profile").addEventListener("click", () => {
    const updatedData = {
      phone:
        document.getElementById("phone").innerText === "Təyin edilməyib"
          ? null
          : document.getElementById("phone").innerText,
      mail:
        document.getElementById("email").innerText === "Təyin edilməyib"
          ? null
          : document.getElementById("email").innerText,
      date_of_birth:
        document.getElementById("date_of_birth").innerText === "Təyin edilməyib"
          ? null
          : document.getElementById("date_of_birth").innerText,
    }

    fetch(profileUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(updatedData),
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
        // Show success message
        const message = document.createElement("div")
        message.className = "message message-success"
        message.textContent = "Profile updated successfully!"

        const profileActions = document.querySelector(".profile-actions")
        profileActions.insertAdjacentElement("beforebegin", message)

        // Remove message after 3 seconds
        setTimeout(() => {
          message.remove()
        }, 3000)
      })
      .catch((error) => {
        console.error("Xəta:", error)

        // Show error message
        const message = document.createElement("div")
        message.className = "message message-error"
        message.textContent = "Error updating profile. Please try again."

        const profileActions = document.querySelector(".profile-actions")
        profileActions.insertAdjacentElement("beforebegin", message)

        // Remove message after 3 seconds
        setTimeout(() => {
          message.remove()
        }, 3000)
      })
  })
})

