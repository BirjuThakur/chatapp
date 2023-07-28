const express = require("express");
const app = express();
const port = process.env.PORT || 8000 ;
const cors = require("cors");
const socket = require("socket.io");

app.use(cors({
    origin:"http://127.0.0.1:3000"
}));

app.get("/",(req,res)=>{
    res.send("welcome")
})

const server = app.listen(port,()=>{
    console.log(`running on port ${port}`)
})

//use socket 
const io = socket(server,{
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.on("room_join",(data)=>{
        socket.join(data)
        console.log("join room ",data)
    })
    // it sends data is in object {room:"", nama:"", message:""}
    socket.on("send_message",(data)=>{
        console.log("message getting",data)
        socket.to(data.room).emit("recieve_message",data)
    })
    
    //user disconnected
    socket.on("disconnect",()=>{
        console.log("user disconnect")
    })
})