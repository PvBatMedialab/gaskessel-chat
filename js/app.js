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

/* ================================
   GASKESSEL ADMIN-MENÜ
   ================================ */

if (localStorage.getItem("username") === "Gaskessel") {

    /* Kleines Zahnrad */

    const adminButton = document.createElement("button");

    adminButton.textContent = "⚙";
    adminButton.id = "adminButton";

    document.body.appendChild(adminButton);


    /* Admin-Menü erstellen */

    const adminMenu = document.createElement("div");

    adminMenu.id = "adminMenu";

    document.body.appendChild(adminMenu);


    /* Verwaltung zurücksetzen */

    function showLoginMenu() {

        adminMenu.innerHTML = `
            <div class="adminTitle">
                GASKESSEL
            </div>

            <button id="adminLoginButton">
                VERWALTUNG ÖFFNEN
            </button>
        `;


        document
            .getElementById("adminLoginButton")
            .addEventListener("click", function() {

                const password = prompt(
                    "Bitte Admin-Passwort eingeben:"
                );

                if (!password) return;

                socket.emit("admin login", password);

            });

    }


    /* Anfangszustand */

    showLoginMenu();


    /* Zahnrad öffnen / schließen */

    adminButton.addEventListener("click", function() {

        if (adminMenu.style.display === "block") {

            adminMenu.style.display = "none";

        } else {

            showLoginMenu();

            adminMenu.style.display = "block";

        }

    });


    /* Login-Ergebnis */

    socket.on("admin login result", result => {

        if (!result.success) {

            alert("Falsches Passwort.");

            return;

        }


        /* Verwaltung anzeigen */

        adminMenu.innerHTML = `
            <div class="adminTitle">
                GASKESSEL – VERWALTUNG
            </div>

            <button id="pdfChatButton">
                CHAT ALS PDF SPEICHERN
            </button>

            <button id="resetChatButton">
                CHAT ZURÜCKSETZEN
            </button>
        `;


        /* PDF */

        document
            .getElementById("pdfChatButton")
            .addEventListener("click", function() {

                const now = new Date();

                const date = now.toLocaleDateString("de-DE");

                const time = now.toLocaleTimeString(
                    "de-DE",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


                /* PDF-Kopf */

                const pdfHeader =
                    document.createElement("div");

                pdfHeader.id = "pdfHeader";

                pdfHeader.innerHTML = `
                    <h1>GASKESSEL – ${window.CHATROOM}</h1>
                    <p>${date} · ${time} Uhr</p>
                `;

                document.body.appendChild(pdfHeader);


                /* Druckansicht öffnen */

                window.print();


                /* PDF-Kopf wieder entfernen */

                pdfHeader.remove();


                /* Verwaltung schließen */

                adminMenu.style.display = "none";

                /* Beim nächsten Öffnen wieder Passwort verlangen */

                showLoginMenu();

            });


        /* Reset */

        document
            .getElementById("resetChatButton")
            .addEventListener("click", function() {

                const confirmation = confirm(
                    "Möchtest du den Chat wirklich zurücksetzen?\n\n" +
                    "Alle Nachrichten dieses Chatraums werden gelöscht."
                );

                if (!confirmation) return;


                socket.emit(
                    "reset room",
                    window.CHATROOM
                );


                /* Verwaltung schließen */

                adminMenu.style.display = "none";

                /* Beim nächsten Öffnen wieder Passwort verlangen */

                showLoginMenu();

            });

    });

}


/* Chat wurde zurückgesetzt */

socket.on("chat reset", room => {

    if (room === window.CHATROOM) {

        chatBox.innerHTML = "";

    }

});