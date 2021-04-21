const express = require("express")
const { connect, StringCodec } = require("nats")

const app = express()
const port = 3002
const NATS_URL = process.env.NATS_URL || "nats://localhost:4222"

var bodyParser = require("body-parser")
const { initDB, canConnectToDb } = require("./src/initdb")
const { getTodos, addTodo, toggle } = require("./src/todos")

let nc
const sc = StringCodec()

const connectNats = async () => {
  try {
    nc = await connect({
      servers: NATS_URL,
    })
    console.log("Connected to", nc.getServer())
  } catch (error) {
    console.log("Error connecting to", NATS_URL)
  }
}

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
      nc.publish("todoevents", sc.encode(`Todo added: ${description}`))
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
    const { done, description } = await toggle(id)
    nc.publish(
      "todoevents",
      sc.encode(
        `Todo ${description} marked as ${done ? "done" : "not done"} id: ${id}`
      )
    )
    console.log("todo marked as done, id", id)
    const todos = await getTodos()
    res.json(todos)
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log("Nats connected", nc.getServer())
    console.log("sending nats testmessage")
    nc.publish("todoevents", sc.encode(`Testmessage`))
  })
}

const go = async () => {
  await connectNats()
  await initDB()
  listen()
}

go()
