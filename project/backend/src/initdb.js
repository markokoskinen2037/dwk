const { Client } = require("pg")

const initDB = async (callback) => {
  console.log("Initing db")
  const client = new Client()
  await client.connect()

  await client.query(
    "CREATE TABLE IF NOT EXISTS todos (id serial PRIMARY KEY,description VARCHAR(255) NOT NULL, done BOOLEAN NOT NULL)"
  )

  client.end()
  callback()
}

module.exports = {
  initDB,
}
