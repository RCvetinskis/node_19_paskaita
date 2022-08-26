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

//  padaryti FRONT END JOG GALIMA PASIRINKT KURIAM USERIUI ZINUTE SIUSI


let admin_id = null
let chats = []
const maxLength = 5
io.on("connection", (socket) => {
    socket.emit("space_left", maxLength - chats.length)
    socket.on("admin_login", () =>  admin_id = socket.id )

    socket.on("user_login", (data) => { 
        const newChat = {
            id: socket.id,
            messages: [] ,
            username: data.username,
            color: data.color
        }
        chats.push(newChat)
        io.to(admin_id).emit("chats", chats)
        socket.emit("chat", newChat)
    })
    socket.on("message", (data) => {
        console.log(data);
        const admin = admin_id === socket.id
        const chatIndex = chats.findIndex(x => x.id === data.id)

        const now = new Date();
        const current = now.getHours() + ':' + now.getMinutes();

       let msg ={
        from: admin ? "admin" : chats[chatIndex].username,
        value: data.message,
        time: current
       }
       chats[chatIndex].messages.push(msg)

        io.to(admin_id).emit("chats", chats)
        io.to(data.id).emit("chat", chats[chatIndex])

    })

    socket.on("disconnect", ()=>{
        chats = chats.filter(x => x.id !== socket.id)
        io.to(admin_id).emit("chats", chats)
    })




})






