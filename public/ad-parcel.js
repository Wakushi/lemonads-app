;(function () {
  window.onload = () => {
    const DEV_MODE = false
    const domainURL = DEV_MODE
      ? "http://localhost:3000/api"
      : "https://lemonads.vercel.app/api"

    const container = document.getElementById("ad-parcel-container")
    const adParcelId = container.getAttribute("data-ad-parcel-id")
    const adContentUrl = `${domainURL}/ad?adParcelId=${adParcelId}`

    function forceRedraw(element) {
      if (!element) {
        return
      }

      const n = document.createTextNode(" ")
      const disp = element.style.display

      element.appendChild(n)
      element.style.display = "none"

      setTimeout(() => {
        element.style.display = disp
        n.parentNode.removeChild(n)
      }, 20)
    }

    function sendClickData(adParcelId) {
      fetch(`${domainURL}/ad`, {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adParcelId }),
      })
    }

    fetch(adContentUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        container.innerHTML = data.htmlContent
        forceRedraw(container)
        container.addEventListener("click", function () {
          sendClickData(adParcelId)
        })
      })
      .catch((error) => console.error("Error fetching ad content:", error))
  }
})()
