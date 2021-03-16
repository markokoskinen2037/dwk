const express = require("express")
const app = express()
const port = 3002

var bodyParser = require("body-parser")

let todos = [
  {
    description: "learn kube",
    done: false,
  },
  {
    description: "clearn room",
    done: true,
  },
]

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.json(todos)
})

app.post("/", (req, res) => {
  const { description, done } = req.body
  todos.push({ description, done })
  res.json(todos)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
