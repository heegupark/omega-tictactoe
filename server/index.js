require('dotenv/config');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const express = require('express');
const app = express();
app.use(staticMiddleware);
app.use(express.json());
// for socket communication
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});
let rooms = [];
io.on('connection', socket => {
  socket.on('create-room', (data, callback) => {
    rooms.push({ id: socket.id, roomId: data.id, name: data.name, players: [] });
    // socket.emit('room-list', { success: true, rooms });
    socket.broadcast.emit('room-list', { success: true, rooms });
  });

  socket.on('join-room', (data, callback) => {
    const index = rooms.findIndex(room => room.roomId === data.roomId);
    const numberOfPlayers = rooms[index].players.length;
    if (numberOfPlayers >= 2) {
      rooms.map(room => room.roomId.toString() === data.roomId.toString() ? room.players.push({ player: data.player, ready: false }) : '');
      socket.emit('room', { success: false, message: 'unable to join' });
    } else {
      rooms.map(room => room.roomId.toString() === data.roomId.toString() ? room.players.push({ player: data.player, ready: false }) : '');
      socket.emit('room', { success: true, rooms });
      socket.broadcast.emit('room', { success: true, rooms });
    }
  });

  socket.on('game-ready', (data, callback) => {
    rooms.map(room => {
      const index = room.players.findIndex(player => player.player.toString() === data.player.toString());
      room.players[index].ready = true;
      return room;
    });
    socket.emit('room', { success: true, rooms });
    socket.broadcast.emit('room', { success: true, rooms });
  });

  socket.on('leave-room', (data, callback) => {
    rooms.map(room => {
      const index = room.players.findIndex(player => player.player.toString() === data.player.toString());
      return room.roomId.toString() === data.roomId.toString() ? room.players.splice(index, 1) : '';
    });
    socket.emit('room', { success: true, rooms });
    socket.broadcast.emit('room', { success: true, rooms });
  });

  socket.on('refresh-room', (data, callback) => {
    socket.emit('room-list', { success: true, rooms });
  });

  socket.emit('room-list', { success: true, rooms });

  socket.on('disconnect', () => {
    const newRooms = rooms.filter(room => room.id.toString() !== socket.id.toString());
    rooms = [...newRooms];
    socket.broadcast.emit('room-list', { success: true, rooms });
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  });
});
// for error handling
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});
server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('[http] Server listening on port', process.env.PORT);
});
