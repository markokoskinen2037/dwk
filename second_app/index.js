const express = require("express")
const app = express()
const port = 3001

var fs = require("fs")

let count = 0
const PONGFILELOCATION = `${__dirname}/files/pongcount`

const writePongCountToFile = () => {
  fs.writeFile(PONGFILELOCATION, String(count), function (err) {
    if (err) return console.log(err)
    console.log(`${count} > ${PONGFILELOCATION}`)
  })
}

app.get("/", (req, res) => {
  res.send(`pong ${count}`)
  count++
  writePongCountToFile()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
