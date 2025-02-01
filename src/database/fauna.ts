import { Client } from "fauna"

export default new Client({
    secret: process.env.FAUNA_SECRET_KEY || "client-side"
})