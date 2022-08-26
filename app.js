const express = require("express")
const cors = require("cors")
const mainRouter = require("./Routers/mainRouter")
const app = express()
const mongoose = require("mongoose")
const session = require("express-session")
const http = require("http").createServer(app)
const socket = require("socket.io")
require("dotenv").config()


mongoose.connect(process.env.MONGO_KEY)
    .then(res => {
        console.log("CONNECTION SUCCESFULL");
    }).catch(e => {
        console.log(e);
    })

const io = socket(http, { cors: { origin: "http://localhost:3000" } })

//  padaryti FRONT END JOG GALIMA PASIRINKT KURIAM USERIUI ZINUTE SIUSI


let admin_id
const users = []


io.on("connection", (socket) => {

    socket.on("admin_login", () => {
        admin_id = socket.id


    })

    socket.on("user_login", () => {
        users.push({ id: socket.id, messages: [] })
    })
    socket.on("message_to_admin", (message) => {

        const userIndex = users.findIndex(x => x.id === socket.id)

        users[userIndex].messages.push({
            message,
            sender: socket.id
        })


        io.to(admin_id).to(users[userIndex].id).emit("display_users_objects", users)

        //   io.to(users[userIndex].id).to( admin_id ).emit("display_admin_messages", users[userIndex])

    })

    socket.on("message_from_admin", (message, sender) => {
        const userIndex = users.findIndex(x => x.id === sender)
        users[userIndex].messages.push({
            message,
            sender: "admin"
        })
        console.log(users);
        io.to(sender).to(admin_id).emit("display_admin_messages", users)
    })



})







http.listen(4000)
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true,
    methods: "GET, POST"

}))


app.use(session({
    secret: "535ds6r64345",
    resave: false,
    saveUninitialized: true
}))


app.use("/", mainRouter)