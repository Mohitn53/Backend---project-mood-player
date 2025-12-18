const ImageKit = require("@imagekit/nodejs").default

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
})

async function uploadFile(file) {
  const result = await imagekit.files.upload({
    file: file.buffer.toString("base64"),
    fileName: file.originalname,
    folder:"moody-player",
    fileType: file.mimetype.startsWith("video") ? "video" : "image",
  })

  return result
}

module.exports = uploadFile
