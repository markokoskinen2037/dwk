const { Client } = require("pg")

const getTodos = async () => {
  const client = new Client()
  await client.connect()
  const result = await client.query("SELECT * FROM todos ORDER BY id DESC")
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

const toggle = async (id) => {
  const client = new Client()
  await client.connect()

  const temp = await client.query("SELECT * from todos where id=$1", [id])
  const newVal = !temp.rows[0].done
  const result = await client.query("UPDATE todos set done=$2 where id=$1", [
    id,
    newVal,
  ])

  client.end()

  return {
    done: newVal,
    description: temp.rows[0].description,
  }
}

module.exports = {
  getTodos,
  addTodo,
  toggle,
}
