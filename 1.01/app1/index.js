const crypto = require("crypto")
var RANDOM_STRING = crypto.randomBytes(20).toString("hex")

const printStringWithTimeStamp = () => {
  console.log(new Date().toLocaleTimeString(), RANDOM_STRING)
}

setInterval(() => {
  printStringWithTimeStamp()
}, 5000)
