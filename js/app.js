const socket = io();

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const chatBox = document.getElementById("chatBox");

const username = prompt("Welche Schwester / welcher Ort bist du?") || "Anonym";

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();

    if (text === "") return;

    socket.emit("chat message", {
        name: username,
        text: text
    });

    input.value = "";
});

socket.on("chat message", function(data) {

    const message = document.createElement("div");
    message.classList.add("message");

    message.innerText = data.name + ": " + data.text;

    messages.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
});