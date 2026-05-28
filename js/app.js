const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const chatBox = document.getElementById("chatBox");

form.addEventListener("submit", function(event) {

    /* VERHINDERT NEULADEN */

    event.preventDefault();

    const messageText = input.value;

    if (messageText.trim() === "") return;

    /* neue Nachricht erstellen */

    const message = document.createElement("div");

    message.classList.add("message");

    message.innerHTML =
    "<span class='sender'>Gaskessel:</span> " +
    messageText;

    /* Nachricht in Chat einsetzen */

    chatBox.appendChild(message);

    /* Input leeren */

    input.value = "";

    /* automatisch nach unten scrollen */

    chatBox.scrollTop = chatBox.scrollHeight;
});


const menuButtons = document.querySelectorAll(".menuButton");

menuButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const content =
            button.nextElementSibling;

        /* andere schließen */

        document
            .querySelectorAll(".menuContent")
            .forEach(function(item) {

                if (item !== content) {
                    item.style.display = "none";
                }

            });

        /* aktuelles öffnen */

        if (content.style.display === "block") {

            content.style.display = "none";

        } else {

            content.style.display = "block";

        }

    });

});
