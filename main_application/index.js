const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const crypto = require("crypto")
var RANDOM_STRING = crypto.randomBytes(20).toString("hex")
const TIMESTAMPFILENAME = `${__dirname}/files/timestamps.txt`
const PONGFILELOCATION = `${__dirname}/files/pongcount`
let IMAGE_LAST_UPDATED_AT = null
var fs = require("fs")
const fetch = require("node-fetch")

const getStringWithTimeStamp = () => {
  return `${new Date().toLocaleTimeString()} ${RANDOM_STRING}`
}

const loadDailyImage = () => {
  console.log("Loading fresh daily image")
  IMAGE_LAST_UPDATED_AT = new Date()
  return fetch("https://picsum.photos/1200").then((res) => {
    const dest = fs.createWriteStream(`${__dirname}/files/dailyimage.jpg`)
    res.body.pipe(dest)
  })
}

const getPongCount = () => {
  return fetch("http://pingpong-svc.project.svc.cluster.local/pingpong").then(
    (res) => {
      return res.json().then((data) => {
        console.log(data)
        return data.count
      })
    }
  )
}

const pingpongAppAvailable = async () => {
  try {
    const res = await fetch(
      "http://pingpong-svc.project.svc.cluster.local/healthz"
    )
    console.log(res.status)
    return !!(res.status == 200)
  } catch (e) {
    return false
  }
}

var imageLoader = async (req, res, next) => {
  const difference = new Date() - new Date(IMAGE_LAST_UPDATED_AT)
  const differenceInDays = Math.round(
    Math.abs(difference / (24 * 60 * 60 * 1000))
  )

  if (differenceInDays === 0) return next()

  await loadDailyImage()
  next()
}

app.use(imageLoader)

app.get("/healthz", async (req, res) => {
  const ok = await pingpongAppAvailable()
  console.log("ok", ok)
  ok ? res.sendStatus(200) : res.sendStatus(500)
})

app.get("/", function (req, res) {
  res.send("root of mainapp")
})

app.get("/status", async (req, res) => {
  let pongCount = undefined
  try {
    pongCount = await getPongCount()
  } catch (error) {
    console.log("failed get pongocunt, version 2")
    console.log(error)
    console.log(error.message)
  }
  const data = getStringWithTimeStamp()
  const envMessage = process.env.MESSAGE || "no env message defined :("
  console.log(data, pongCount)
  res
    .send(
      envMessage + "<br></br>" + data + "<br></br>" + "pings/pongs:" + pongCount
    )
    .end()
})

app.get("/dailyimage", (req, res) => {
  res.sendFile(`${__dirname}/files/dailyimage.jpg`)
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
  console.log(`Server started in port ${port}`)
})
