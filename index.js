const { prototype } = require('events');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port=process.env.PORT || 8000

app.get('/', (req, res) => {
    res.sendFile('/users/ketan chouhan/chatapp/index.html');
});
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
