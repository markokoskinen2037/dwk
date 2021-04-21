const { Client } = require("pg")

const initDB = async () => {
  try {
    console.log("Trying to init DB")
    const client = new Client()
    await client.connect()
    await client.query(
      "CREATE TABLE IF NOT EXISTS todos (id serial PRIMARY KEY,description VARCHAR(255) NOT NULL, done BOOLEAN NOT NULL)"
    )
    client.end()
  } catch (error) {
    console.log("Failed to init DB, unclucky")
  }
}

const canConnectToDb = async () => {
  try {
    console.log("checking db connection")
    const client = new Client()
    await client.connect()
    client.end()
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  initDB,
  canConnectToDb,
}
