const { connect, StringCodec } = require("nats")
const NATS_URL = process.env.NATS_URL || "nats://localhost:4222"
const BOT_TOKEN = process.env.BOT_TOKEN

const { Telegraf } = require("telegraf")
const bot = new Telegraf(BOT_TOKEN)

bot.hears("hi", (ctx) => ctx.reply("Hey there"))
bot.launch()

let nc
const sc = StringCodec()

const connectNats = async () => {
  try {
    nc = await connect({
      servers: NATS_URL,
    })
    console.log("Connected to", nc.getServer())
  } catch (error) {
    console.log("Error connecting to", NATS_URL)
  }
}

const listen = () => {
  console.log("Listening for nats messages...")

  const sub = nc.subscribe("todoevents", { queue: "workers" })
  ;(async () => {
    for await (const m of sub) {
      bot.telegram.sendMessage("-535138911", sc.decode(m.data))
      console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`)
    }
    console.log("subscription closed")
  })()
}

const go = async () => {
  await connectNats()
  listen()
}

go()
