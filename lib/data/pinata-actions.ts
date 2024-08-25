const JWT = process.env.PINATA_JWT

export const pinJSONToIPFS = async (json: any, filename: string) => {
  const blob = new Blob([JSON.stringify(json)], { type: "application/json" })
  const formData = new FormData()
  formData.append("file", blob, `${filename}.json`)

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: formData,
    }
  )
  const { IpfsHash } = await response.json()
  return IpfsHash
}

export const pinFileToIPFS = async (imageBuffer: Buffer, filename: string) => {
  try {
    const blob = new Blob([imageBuffer], { type: "image/png" })
    const formData = new FormData()
    formData.append("file", blob, `${filename}.png`)

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error("Failed to pin file to IPFS")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error pinning file to IPFS:", error)
    throw error
  }
}

export const unpinFile = async (hash: string) => {
  try {
    await fetch(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    })
  } catch (error) {
    console.error("Error unpinning file to IPFS:", error)
    throw error
  }
}
