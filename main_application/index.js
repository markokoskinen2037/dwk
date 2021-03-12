const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const VERSION = "v2"
const crypto = require("crypto")
var RANDOM_STRING = crypto.randomBytes(20).toString("hex")
const TIMESTAMPFILENAME = "timestamps.txt"
const PONGFILELOCATION = `${__dirname}/files/pongcount`
var fs = require("fs")

const getStringWithTimeStamp = () => {
  return `${new Date().toLocaleTimeString()} ${RANDOM_STRING}`
}

app.use(express.static(path.join(__dirname, "/frontti/build")))

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontti/build", "index.html"))
})

app.get("/status", (req, res) => {
  const data = getStringWithTimeStamp()

  console.log(data)

  fs.readFile(PONGFILELOCATION, "utf8", function (err, pongcount) {
    console.log(pongcount)
    res.send(data + "<br></br>" + "pings/pongs:" + pongcount).end()
  })

  console.log("nice")
})

app.get("/gethashfromfile", (req, res) => {
  fs.readFile(
    `${__dirname}/files/${TIMESTAMPFILENAME}`,
    "utf8",
    function (err, data) {
      return res.send(data)
    }
  )
})

app.listen(port, () => {
  console.log(`${VERSION} Server started in port ${port}`)
})
