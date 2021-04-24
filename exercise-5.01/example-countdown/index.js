const scrape = require("website-scraper")
const PuppeteerPlugin = require("website-scraper-puppeteer")
const path = require("path")
const express = require("express")
const URL_TO_CLONE = process.env.URL_TO_CLONE || "http://example.org"

const letsgo = async () => {
  console.log("scraping...")

  try {
    await scrape({
      // Provide the URL(s) of the website(s) that you want to clone
      // In this example, you can clone the Our Code World website
      urls: [URL_TO_CLONE],
      // Specify the path where the content should be saved
      // In this case, in the current directory inside the ourcodeworld dir
      directory: path.resolve(__dirname, "public"),
      // Load the Puppeteer plugin
      plugins: [
        new PuppeteerPlugin({
          launchOptions: {
            args: ["--no-sandbox"],
            // If you set  this to true, the headless browser will show up on screen
            headless: true,
          } /* optional */,
          scrollToBottom: {
            timeout: 10000,
            viewportN: 10,
          } /* optional */,
        }),
      ],
    })

    console.log("scraped.")

    const app = express()
    const port = 3000

    app.use(express.static("public"))

    app.get("/", (req, res) => {
      res.send("Hello World!")
    })

    app.listen(port, () => {
      console.log(`Serving the closed website at http://localhost:${port}`)
    })
  } catch (error) {
    console.log("failed to scrape")
    console.log(error)

    const app = express()
    const port = 3000

    app.get("/", (req, res) => {
      res.send("Failed to scrape")
    })

    app.listen(port, () => {
      console.log(`Serving errorpage at http://localhost:${port}`)
    })
  }
}

letsgo()

// const time = Number(process.argv[2]) || 10

// if (time < 3) console.log('Time is coming to an end!')

// console.log('Time:', time)
