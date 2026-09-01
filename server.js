const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gaskessel3027";

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
    fs.writeFileSync(
        messagesFile,
        JSON.stringify(messages, null, 2)
    );
}

io.on("connection", socket => {

    /* Chatroom betreten */

    socket.on("join room", room => {

        const messages = loadMessages();

        const roomMessages = messages.filter(
            message => message.room === room
        );

        socket.emit("chat history", roomMessages);

    });


    /* Neue Nachricht */

    socket.on("chat message", data => {

        console.log("NACHRICHT ANGEKOMMEN:", data);

        const messages = loadMessages();

        const message = {
            room: data.room,
            name: data.name,
            text: data.text,
            color: data.color,
            time: new Date().toISOString()
        };

        messages.push(message);

        saveMessages(messages);

        io.emit("chat message", message);

    });

  /* Admin anmelden */

socket.on("admin login", password => {

    if (password === ADMIN_PASSWORD) {

        socket.adminAuthenticated = true;

        socket.emit("admin login result", {
            success: true
        });

    } else {

        socket.emit("admin login result", {
            success: false
        });

    }

});


    /* Chatroom zurücksetzen */

    socket.on("reset room", room => {

        if (!socket.adminAuthenticated) {
            return;
        }

        console.log("CHAT WIRD ZURÜCKGESETZT:", room);

        const messages = loadMessages();

        const remainingMessages = messages.filter(
            message => message.room !== room
        );

        saveMessages(remainingMessages);

        io.emit("chat reset", room);

    });

});


const PORT = process.env.PORT || 3000;

http.listen(PORT, "0.0.0.0", () => {
    console.log(
        "Server läuft auf http://localhost:" + PORT
    );
});