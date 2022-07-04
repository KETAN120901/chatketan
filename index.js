const { prototype } = require('events');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port=process.env.PORT || 8000
const fs=require('fs');
const index=fs.readFileSync('index.html');
const users={};
app.get('/', (req, res) => {
    res.setHeader('content-Type','text/html')
    res.end(index);
});

io.on('connection', (socket) => {
  socket.on('new-user-joined', name => {console.log(name);
      
      if(name=="" || name==null){
        users[socket.id]='newbie';
        
        socket.broadcast.emit('user-joined',users[socket.id]);
      }
      else{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',users[socket.id]);
      }
    
  });
    socket.on('send', message => {
      
      socket.broadcast.emit('receive',`${users[socket.id]}: ${message}`);
    });
    socket.on('disconnect', message =>{
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
  });
    
  });
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
