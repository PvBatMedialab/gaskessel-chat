const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

const messagesFile = path.join(__dirname, "messages.json");

function loadMessages() {
    if (!fs.existsSync(messagesFile)) {
        return [];
    }

    const content = fs.readFileSync(messagesFile, "utf8");
    if (content.trim() === "") {
        return [];
    }

    return JSON.parse(content);
}

function saveMessages(messages) {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
}

io.on("connection", socket => {
    socket.emit("chat history", loadMessages());

    socket.on("chat message", data => {
        const messages = loadMessages();

        const message = {
    name: data.name,
    text: data.text,
    color: data.color,
    time: new Date().toISOString()
};

        messages.push(message);
        saveMessages(messages);

        io.emit("chat message", message);
    });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log("Server läuft auf http://localhost:" + PORT);
});