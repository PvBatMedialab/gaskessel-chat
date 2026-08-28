const socket = io();

socket.on("connect", () => {
    socket.emit("join room", window.CHATROOM);
});

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");

function addMessage(message) {
    const div = document.createElement("div");

    div.classList.add("message");

    div.innerHTML =
        "<span class='sender'>" +
        message.name +
        ":</span> " +
        message.text;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}


/* Alte Nachrichten laden */

socket.on("chat history", messages => {

    chatBox.innerHTML = "";

    messages.forEach(message => {
        addMessage(message);
    });

});


/* Neue Nachrichten empfangen */

socket.on("chat message", message => {

    if (message.room === window.CHATROOM) {
        addMessage(message);
    }

});


/* Nachricht senden */

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    const senderName =
        localStorage.getItem("username") || "Unbekannt";

    console.log("ROOM:", window.CHATROOM);

    socket.emit("chat message", {
        room: window.CHATROOM,
        name: senderName,
        text: text,
        color: "red"
    });

    input.value = "";

});


/* Menü */

const menuButtons = document.querySelectorAll(".menuButton");

menuButtons.forEach(button => {

    button.addEventListener("click", function() {

        const content = button.nextElementSibling;

        document
            .querySelectorAll(".menuContent")
            .forEach(item => {

                if (item !== content) {
                    item.style.display = "none";
                }

            });

        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }

    });

});

