;(function () {
  window.onload = async () => {
    const DEV_MODE = false
    const domainURL = DEV_MODE
      ? "http://localhost:3000/api"
      : "https://lemonads.vercel.app/api"

    const container = document.getElementById("ad-parcel-container")
    const adParcelId = container.getAttribute("data-ad-parcel-id")
    const adContentUrl = `${domainURL}/ad?adParcelId=${adParcelId}`

    function forceRedraw(element) {
      console.log("Redrawing ", element)
      if (element) {
        const clone = element.cloneNode(true)
        element.replaceWith(clone)
        element.style.display = "none"
        element.offsetHeight // Trigger a reflow
        element.style.visibility = "hidden"
        element.style.visibility = "visible"
        element.style.transform = "scale(1)" // Ensure it's in the view
        window.scrollBy(0, 1) // Force a redraw by scrolling
        window.scrollBy(0, -1)
      }
    }

    function observeMutations(targetNode) {
      const config = { attributes: true, childList: true, subtree: true }

      const callback = function (mutationsList, observer) {
        console.log("DOM mutation observed:", mutationsList)
        forceRedraw(targetNode)
      }

      const observer = new MutationObserver(callback)
      observer.observe(targetNode, config)
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

    try {
      const response = await fetch(adContentUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched data: ", data)

      setTimeout(() => {
        container.innerHTML = data.htmlContent
        observeMutations(container)
        forceRedraw(container)
      }, 100)

      container.addEventListener("click", function () {
        sendClickData(adParcelId)
      })
    } catch (error) {
      console.error("Error fetching ad content:", error)
    }
  }
})()
