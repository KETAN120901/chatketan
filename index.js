const { prototype } = require('events');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs=require('fs');
const index=fs.readFileSync('index.html');
const port=process.env.PORT || 8000

app.get('/', (req, res) => {
    res.setHeader('content-Type','text/html')
    res.end(index);
});
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
