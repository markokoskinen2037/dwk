const express = require("express")
const app = express()
const port = 3000

let count = 0

app.get("/", (req, res) => {
  res.send(`pong ${count}`)
  count++
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
