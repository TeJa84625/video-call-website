const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  users++;
  io.emit('userCount', users);

  socket.on('disconnect', () => {
    users--;
    io.emit('userCount', users);
  });

  socket.on('joinCall', (username) => {
    socket.broadcast.emit('call', { username, id: socket.id });
  });

  socket.on('signal', (data) => {
    io.to(data.id).emit('signal', data);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
