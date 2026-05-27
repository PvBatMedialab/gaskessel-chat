const socket = io();

const sisterSelect = document.getElementById("sisterSelect");
const chatContainer = document.getElementById("chatContainer");

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const chatBox = document.getElementById("chatBox");

let username = "";
let userColor = "black";

function showMessage(data) {
    const message = document.createElement("div");
    message.classList.add("message");

    message.innerText = data.name + ": " + data.text;
    message.style.color = data.color || "black";

    messages.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.querySelectorAll("#sisterSelect button").forEach(function(button) {
    button.addEventListener("click", function() {
        username = button.dataset.name;
        userColor = button.dataset.color;

        sisterSelect.style.display = "none";
        chatContainer.style.display = "flex";
    });
});

socket.on("chat history", function(history) {
    history.forEach(function(data) {
        showMessage(data);
    });
});

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const text = input.value.trim();
    if (text === "") return;
    if (username === "") return;

    socket.emit("chat message", {
        name: username,
        text: text,
        color: userColor
    });

    input.value = "";
});

socket.on("chat message", function(data) {
    showMessage(data);
});