// One generates a new timestamp every 5 seconds and saves it into a file.

const TIMESTAMPFILENAME = "timestamps.txt"
fs = require("fs")

const writeTimestampToFile = (timestamp) => {
  fs.writeFile(
    `${__dirname}/files/${TIMESTAMPFILENAME}`,
    timestamp,
    function (err) {
      if (err) return console.log(err)
      console.log(`${timestamp} > ${TIMESTAMPFILENAME}`)
    }
  )
}

setInterval(() => {
  const timestamp = new Date().toLocaleString()
  writeTimestampToFile(timestamp)
}, 5000)
