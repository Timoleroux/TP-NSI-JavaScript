async function getJson() {
    try {
        const response = await fetch("data.json");
        return await response.json();
    } catch (error) {
        return console.error("Error:", error);
    }
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function deleteCookies(...names) {
    names.forEach((name) => {
        document.cookie = name + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT;";
    });
}

function checkForBackup() {
    button = document.getElementById("resume-game");
    if (!button) {
        return 0;
    }
    if (
        getCookie("current_text") == null ||
        getCookie("name") == null ||
        getCookie("gender") == null ||
        getCookie("profile_picture") == null
    ) {
        document.getElementById("resume-game").disabled = true;
    } else {
        document.getElementById("resume-game").disabled = false;
    }
}

function newGame() {
    deleteCookies("current_text", "name", "gender", "profile_picture");
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("character-container").style.display = "flex";
    document.getElementById("character-choice").value = "";
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
}

function goHome() {
    checkForBackup();
    document.getElementById("start-menu").style.display = "flex";
    document.getElementById("character-container").style.display = "none";
    document.getElementById("story").style.display = "none";
}

function startNewGame() {
    let name = document.getElementById("character-choice").value;
    let gender = document.querySelector('input[name="gender-choice"]:checked').value;

    if (!name) {
        if (gender == "male") {
            var names = ["Jean-Dominique", "Florent", "Sébastien"];
        } else if (gender == "female") {
            var names = ["Marie-Dominique", "Christelle", "Géraldine"];
        }
        name = names[Math.floor(Math.random() * names.length)];
        document.getElementById("character-choice").value = name;
    }

    setCookie("current_text", "start", 1);
    setCookie("name", name, 1);
    setCookie("gender", gender, 1);

    let source = "ressources/profile_pictures/default.jpg";
    if (getCookie("gender") == "male") {
        let i = Math.floor(Math.random() * 5) + 1;
        source = `ressources/profile_pictures/man_${i}.jpg`;
    } else if (getCookie("gender") == "female") {
        let i = Math.floor(Math.random() * 15) + 1;
        source = `ressources/profile_pictures/woman_${i}.jpg`;
    }
    setCookie("profile_picture", source, 1);

    document.getElementById("character-container").style.display = "none";
    document.getElementById("story").style.display = "block";

    loadText();
}

function resumeGame() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("story").style.display = "block";
    loadText();
}

function loadText(answer) {
    // Store the content of data.json inside the variable 'json_content'
    getJson().then((json_content) => {
        let text_name = getCookie("current_text");

        // Hide the choice buttons momentarily
        document.getElementById("choice-container").style.display = "none";

        // Display the name and profile picture in the top right-hand corner
        document.getElementById("name").innerHTML = getCookie("name");
        document.getElementById("profile-picture").src = getCookie("profile_picture");

        // Define which text will be shown
        if (text_name == "start") {
            setCookie("current_text", "intro", 1);
        } else if (json_content[text_name] == undefined) {
            alert(`Impossible d'acceder à json_content[${text_name}]`);
            return false;
        } else if (answer == "answer1") {
            setCookie("current_text", json_content[text_name]["answer_1"][0], 1);
        } else if (answer == "answer2") {
            setCookie("current_text", json_content[text_name]["answer_2"][0], 1);
        }

        // Save the name of the text in the cookies
        text_name = getCookie("current_text");

        if (json_content[text_name]["type"] == "random") {
            const proba = json_content[text_name]["answer_1"][2];
            const random_num = Math.random();
            const index = random_num < proba ? 0 : 1;
            text_name = json_content[text_name][`answer_${index + 1}`][0];
        }

        texte = json_content[text_name]["content"];

        if (json_content[text_name]["type"] == "direct") {
            text_name = json_content[text_name]["redirect"];
            setCookie("current_text", text_name, 1);
            texte += json_content[text_name]["content"];
        }
        // Replace all the 'NOM' by the name chosen by the user
        texte = texte.replace(/NOM/g, getCookie("name"));
        document.getElementById("text").innerHTML = "";
        let i = 0;

        // Write the text into '<p id="text">...</p>' with a writing animation
        function displayText(callback) {
            if (i < texte.length) {
                if (document.getElementById("story").style.display == "none") {
                    return 0;
                } else {
                    document.getElementById("text").innerHTML += texte.charAt(i);
                    i++;
                    setTimeout(function () {
                        displayText(callback);
                    }, 30);
                }
            } else {
                callback();
            }
        }

        // The following code will be executed only when the text will be totally shown
        displayText(function () {
            // Display the choice buttons
            if (json_conten[text_name]["redirect"] != "end") {
                document.getElementById("choice-container").style.display = "flex";
            }
            // Replace the text of the choice buttons with the corresponding text
            document.getElementById("choice-1").innerHTML = json_content[text_name]["answer_1"][1];
            document.getElementById("choice-2").innerHTML = json_content[text_name]["answer_2"][1];
        });

        if (text_name == "end") {
            deleteCookies("current_text", "name", "gender", "profile_picture");
            return 0;
        }
    });
}

function changeBackgroundColor(hex) {
    if (hex == null) {
        let selectedColor = document.getElementById("background-color-selector").value;
        document.body.style.backgroundColor = selectedColor;
    } else {
        document.body.style.backgroundColor = hex;
    }
    return document.body.style.backgroundColor;
}

function getBackgroundColor() {
    if (getCookie("bg_color") == null) {
        return "#c291f0";
    }
    return getCookie("bg_color");
}

function saveBackgroundColor(hex) {
    color = changeBackgroundColor(hex);
    setCookie("bg_color", color, 1);
}

window.addEventListener("load", () => {
    changeBackgroundColor(getBackgroundColor());
});

window.addEventListener("load", checkForBackup());
