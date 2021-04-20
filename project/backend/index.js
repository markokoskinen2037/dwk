const express = require("express")
const app = express()
const port = 3002

var bodyParser = require("body-parser")
const { initDB, canConnectToDb } = require("./src/initdb")
const { getTodos, addTodo, markAsDone } = require("./src/todos")

const listen = () => {
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
    res.send("hello")
  })

  app.get("/healthz", async (req, res) => {
    const ok = await canConnectToDb()
    ok ? res.sendStatus(200) : res.sendStatus(500)
  })

  app.get("/todos", async (req, res) => {
    const todos = await getTodos()
    res.json(todos)
  })

  app.post("/todos", async (req, res) => {
    const { description, done } = req.body
    try {
      await addTodo(description, done)
      console.log("Todo added", description)
    } catch ({ message }) {
      console.log(message)
      return res.status(400).send(message)
    }
    const todos = await getTodos()
    res.json(todos)
  })

  app.put("/todos/:id", async (req, res) => {
    const { id } = req.params
    const temp = await markAsDone(id)
    res.json(temp)
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

initDB(listen)
