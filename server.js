require('dotenv').config();
const { prototype } = require('events');
const express = require('express');
const app = express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const http = require('http');
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT=process.env.PORT || 8000;
const users = {};
const ids = {};
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);
//mongoose.connect("mongodb://localhost:27017/chatDB");
const msgSchema={
  name:String,
  content:String,
  id:String
};
const msg=mongoose.model("msg",msgSchema);
app.get('/', (req, res) => {
  
  async function f1(){
    const query=await msg.find();
    res.render("client",{que:query});
    
  }
  f1();
  
  
});
io.on('connection', (socket) => {
  socket.on('new-user-joined', name => {
    if (name == "" || name == null) {
      users[socket.id] = `newbie`;
      socket.broadcast.emit('user-joined', users[socket.id]);
    }
    else {
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', users[socket.id]);
    }
  });
  socket.on('onlineusers', namesender => {
    socket.broadcast.emit(namesender, users[socket.id]);
  })
  socket.on('send', message => {
    const msg1=new msg({
      name:users[socket.id],
      content:message,
      id:socket.id
    });
    msg1.save();
    socket.broadcast.emit('receive', `<span style="color: blue">${users[socket.id]} </span> : ${message}`);
  });
  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});
server.listen(PORT, () => {
  console.log("listening on 8000");
});
