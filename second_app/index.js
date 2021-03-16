const express = require("express")
const app = express()
const port = 3001

let count = 0

app.get("/", (req, res) => {
  res.json({ count: count })
  count++
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
