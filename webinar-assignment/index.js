const express = require("express")
const app = express()
const port = 3000

const client = require("prom-client")
const register = client.register
const catCounter = new client.Counter({
  name: "cat_view_counter",
  help: "Number of cat pictures viewed",
})
const dogCounter = new client.Counter({
  name: "dog_view_counter",
  help: "Number of dog pictures viewed",
})

app.get("/metrics", async (req, res) => {
  const data = await register.metrics()
  res.send(data)
})

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/cat", function (req, res) {
  catCounter.inc(1)
  res.sendFile("images/cat.jpg", { root: __dirname })
})

app.get("/dog", function (req, res) {
  dogCounter.inc(1)
  res.sendFile("images/dog.jpg", { root: __dirname })
})

app.get("/random", function (req, res) {
  const rand = Math.random()
  if (rand <= 0.5) {
    catCounter.inc(1)
    res.sendFile("images/cat.jpg", { root: __dirname })
  } else {
    dogCounter.inc(1)
    res.sendFile("images/dog.jpg", { root: __dirname })
  }
})
app.listen(port, () => {
  console.log(`webinar-assignment app listening at http://localhost:${port}`)
})
