const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const path = require("path");
const server = app.listen(PORT, () => {
  console.log(`We are Listing on the PORT ${PORT}`);
});
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "public")));

let socketsConected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConected.add(socket.id);

  io.emit("clients-total", socketsConected.size);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    io.emit("clients-total", socketsConected.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
