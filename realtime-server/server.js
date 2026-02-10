import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.get('/health', (_, res) => res.json({ ok: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ code }) => {
    const normalized = String(code || 'DEMO').toUpperCase();
    const room = rooms.get(normalized) ?? { players: new Set() };
    if (room.players.size >= 10) return socket.emit('errorMessage', '房间已满');
    room.players.add(socket.id);
    rooms.set(normalized, room);
    socket.join(normalized);
    io.to(normalized).emit('joined', { code: normalized, count: room.players.size });
  });

  socket.on('disconnect', () => {
    for (const [code, room] of rooms.entries()) {
      room.players.delete(socket.id);
      if (!room.players.size) rooms.delete(code);
    }
  });
});

httpServer.listen(4001, () => console.log('Realtime server on :4001'));
