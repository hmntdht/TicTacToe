const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  if (Object.keys(players).length < 2) {
    const symbol = Object.values(players).includes("X") ? "O" : "X";
    players[socket.id] = symbol;
    socket.emit("assignSymbol", symbol);
    io.emit("status", `${symbol} joined the game`);

    socket.on("makeMove", index => {
      if (board[index] === "" && players[socket.id] === currentPlayer) {
        board[index] = currentPlayer;
        io.emit("updateBoard", board);
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        io.emit("turn", currentPlayer);
      }
    });

    socket.on("restart", () => {
      board = ["", "", "", "", "", "", "", "", ""];
      currentPlayer = "X";
      io.emit("updateBoard", board);
      io.emit("turn", currentPlayer);
    });
  } else {
    socket.emit("status", "Game full. Only 2 players allowed.");
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete players[socket.id];
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    io.emit("status", "A player left. Game reset.");
    io.emit("updateBoard", board);
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
