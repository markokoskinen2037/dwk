const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const VERSION = "v2"

app.use(express.static(path.join(__dirname, "/frontti/build")))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontti/build", "index.html"))
})

app.listen(port, () => {
  console.log(`${VERSION} Server started in port ${port}`)
})
