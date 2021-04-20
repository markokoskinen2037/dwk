const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const fetch = require("node-fetch")

app.use(express.static(path.join(__dirname, "/build")))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/build", "index.html"))
})

app.get("/healthz", async (req, res) => {
  const resp = await fetch("http://project-backend-svc:2345/healthz")
  resp.status == "200" ? res.sendStatus(200) : res.sendStatus(500)
})

app.listen(port, () => {
  console.log(`Server started in port ${port}`)
})
