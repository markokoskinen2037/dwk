const express = require("express")
const app = express()
const port = 3000
const VERSION = "v2"

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log(`${VERSION} Server started in port NNNN`)
})
