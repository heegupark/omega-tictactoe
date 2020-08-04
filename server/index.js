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
    if (index >= 0) {
      const numberOfPlayers = rooms[index].players.length;
      if (numberOfPlayers >= 2) {
        rooms.map(room => room.roomId.toString() === data.roomId.toString() ? room.players.push({ user: data.user, ready: false }) : '');
        socket.emit(`room-${data.roomId}`, { success: false, message: 'unable to join' });
      } else {
        rooms.map(room => room.roomId.toString() === data.roomId.toString() ? room.players.push({ user: data.user, ready: false }) : '');
        socket.emit(`room-${data.roomId}`, { success: true, rooms });
        socket.broadcast.emit(`room-${data.roomId}`, { success: true, rooms });
      }
    }
    socket.emit('room-list', { success: true, rooms });
    socket.broadcast.emit('room-list', { success: true, rooms });
  });

  socket.on('refresh-room', (data, callback) => {
    socket.emit(`room-${data.roomId}`, { success: true, rooms });
  });

  socket.on('game-ready', (data, callback) => {
    rooms.map(room => {
      if (room.roomId === data.roomId) {
        const index = room.players.findIndex(player => player.user.toString() === data.user.toString());
        room.players[index].ready = true;
      }
      return room;
    });
    socket.emit(`room-${data.roomId}`, { success: true, rooms });
    socket.broadcast.emit(`room-${data.roomId}`, { success: true, rooms });
  });

  socket.on('leave-room', (data, callback) => {
    rooms.map(room => {
      const index = room.players.findIndex(player => player.user.toString() === data.user.toString());
      if (room.roomId.toString() === data.roomId.toString()) {
        room.players.splice(index, 1);
      }
      return room;
    });
    socket.emit(`room-${data.roomId}`, { success: true, rooms });
    socket.broadcast.emit(`room-${data.roomId}`, { success: true, rooms });

    const newRooms = rooms.filter(room => room.players.length !== 0);
    rooms = [...newRooms];
    socket.emit('room-list', { success: true, rooms });
    socket.broadcast.emit('room-list', { success: true, rooms });
  });

  socket.on('refresh-waiting-room', (data, callback) => {
    const newRooms = rooms.filter(room => room.players.length !== 0);
    rooms = [...newRooms];
    socket.emit('room-list', { success: true, rooms });
  });

  socket.emit('room-list', { success: true, rooms });

  socket.on('play-game', (data, callback) => {
    socket.emit(`play-game-${data.roomId}`, { success: true });
    socket.broadcast.emit(`play-game-${data.roomId}`, { success: true });
  });

  socket.on('click-card', (data, callback) => {
    socket.emit(`click-card-${data.roomId}`, { success: true, cards: data.cards });
    socket.broadcast.emit(`click-card-${data.roomId}`, { success: true, cards: data.cards });
  });

  socket.on('change-player', (data, callback) => {
    socket.emit(`change-player-${data.roomId}`, { success: true });
    socket.broadcast.emit(`change-player-${data.roomId}`, { success: true });
  });

  socket.on('win', (data, callback) => {
    socket.emit(`win-${data.roomId}`, { success: true, result: data.result });
    socket.broadcast.emit(`win-${data.roomId}`, { success: true, result: data.result });
  });

  socket.on('draw', (data, callback) => {
    socket.emit(`draw-${data.roomId}`, { success: true });
    socket.broadcast.emit(`draw-${data.roomId}`, { success: true });
  });

  socket.on('replay', (data, callback) => {
    socket.emit(`replay-${data.roomId}`, { success: true });
    socket.broadcast.emit(`replay-${data.roomId}`, { success: true });
  });

  socket.on('back-to-waiting', (data, callback) => {
    rooms.map(room => {
      if (room.roomId.toString() === data.roomId.toString()) {
        while (room.players.length) {
          room.players.pop();
        }
      }
      return room;
    });
    socket.emit(`back-to-waiting-${data.roomId}`, { success: true });
    socket.broadcast.emit(`back-to-waiting-${data.roomId}`, { success: true });
  });

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
