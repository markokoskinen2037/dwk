const express = require("express")
const app = express()
const port = 3001
const { Client } = require("pg")

const initDB = async () => {
  console.log("Initing db")
  const client = new Client()
  await client.connect()

  await client.query(
    "CREATE TABLE IF NOT EXISTS pingcount (id serial PRIMARY KEY,count integer NOT NULL)"
  )

  const result = await client.query("SELECT * FROM pingcount")

  if (result.rows.length > 1) {
    console.log("removing dupes")
    await client.query("DELETE FROM pingcount")
    await client.query("INSERT INTO pingcount (count) values (0)")
  }

  if (result.rows.length < 1) {
    console.log("created initial count of 0")
    await client.query("INSERT INTO pingcount (count) values (0)")
  }

  client.end()
}

const start = async () => {
  try {
    await initDB()
  } catch (error) {
    console.log(error)
  }

  app.get("/", (req,res) => {
    res.send("roto of pingpong")
  })

  app.get("/pingpong", async (req, res) => {
    const client = new Client()
    await client.connect()
    const data = await client.query("SELECT count from pingcount")
    const count = data.rows[0].count
    await client.end()

    res.json({ count: count })
    updateCount()
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

start()

const updateCount = async () => {
  const client = new Client()
  await client.connect()
  const data = await client.query("SELECT id,count from pingcount")
  const id = data.rows[0].id
  let newCount = data.rows[0].count + 1

  await client.query("UPDATE pingcount set count=$2 where id=$1", [
    id,
    newCount,
  ])

  await client.end()
}
