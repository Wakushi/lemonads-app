;(function () {
  window.onload = async () => {
    const DEV_MODE = false
    const domainURL = DEV_MODE
      ? "http://localhost:3000/api"
      : "https://lemonads.vercel.app/api"

    const container = document.getElementById("ad-parcel-container")
    const adParcelId = container.getAttribute("data-ad-parcel-id")
    const adContentUrl = `${domainURL}/ad?adParcelId=${adParcelId}`

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

    try {
      const response = await fetch(adContentUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      container.innerHTML = data.htmlContent
      container.style.width = "fit-content"

      container.addEventListener("click", function () {
        sendClickData(adParcelId)
      })
    } catch (error) {
      console.error("Error fetching ad content:", error)
    }
  }
})()
