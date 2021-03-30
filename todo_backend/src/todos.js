const { Client } = require("pg")

const getTodos = async () => {
  const client = new Client()
  await client.connect()
  const result = await client.query("SELECT * FROM todos")
  client.end()

  return result.rows
}

const addTodo = async (description, done) => {
  const client = new Client()
  await client.connect()
  const result = await client.query(
    "INSERT INTO todos (description,done) values ($1,$2)",
    [description, !!done]
  )

  client.end()

  return result.rows
}

module.exports = {
  getTodos,
  addTodo,
}
