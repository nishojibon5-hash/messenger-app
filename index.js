const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Database Connect Hoyeche!"))
  .catch(err => console.log("❌ DB Error:", err));

io.on('connection', (socket) => {
  console.log('User joined');
  socket.on('send_message', (data) => {
    io.emit('receive_message', data); // সবার কাছে মেসেজ পাঠিয়ে দিবে
  });
});

server.listen(3000, () => console.log("🚀 Server running on port 3000"));
