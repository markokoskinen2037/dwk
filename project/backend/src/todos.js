const { Client } = require("pg")

const getTodos = async () => {
  const client = new Client()
  await client.connect()
  const result = await client.query("SELECT * FROM todos")
  client.end()

  return result.rows
}

const addTodo = async (description, done) => {
  if (!description || !description.length || description.length > 140)
    throw new Error("Invalid todo length")

  const client = new Client()
  await client.connect()
  const result = await client.query(
    "INSERT INTO todos (description,done) values ($1,$2)",
    [description, !!done]
  )

  client.end()

  return result.rows
}

const markAsDone = async (id) => {
  const client = new Client()
  await client.connect()
  const result = await client.query("UPDATE todos set done=true where id=$1", [
    id,
  ])

  client.end()

  return result.rows
}

module.exports = {
  getTodos,
  addTodo,
  markAsDone,
}
