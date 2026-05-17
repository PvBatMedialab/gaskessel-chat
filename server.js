const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

io.on("connection", socket => {
    socket.on("chat message", data => {
        io.emit("chat message", data);
    });
});

http.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
});