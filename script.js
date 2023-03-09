async function getJson() {
    try {
        const response = await fetch("data.json");
        return await response.json();
    } catch (error) {
        return console.error("Error:", error);
    }
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 2000 00:00:00 GMT;";
}

function onPageLoad() {
    var cur_text = getCookie("current_text");
    var name = getCookie("name");
    var gender = getCookie("gender");
    var picture = getCookie("profile_picture")
    console.log(cur_text)
    console.log(name)
    console.log(gender)
    if (cur_text == null || name == null || gender == null || picture == null) {
        document.getElementById("resume-game").disabled = true;
    } else {
        document.getElementById("resume-game").disabled = false;
    }
}

function newGame() {
    deleteCookie("current_text");
    deleteCookie("name");
    deleteCookie("gender");
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("character-container").style.display = "flex";
    document.getElementById("character-choice").value = "";
    document.getElementById("male").checked = false
    document.getElementById("female").checked = false
}

function goHome() {
    document.getElementById("start-menu").style.display = "flex";
    document.getElementById("character-container").style.display = "none";
    document.getElementById("story").style.display = "none";
    
}

function startNewGame() {
    var name = document.getElementById("character-choice").value;
    var gender = document.querySelector('input[name="gender-choice"]:checked').value;

    if (!name) {
        if (gender == "male") {
            var names = ["Jean-Dominique", "Florent", "Sébastien"];
        } else if (gender == "female") {
            var names = ["Marie-Dominique", "Christelle", "Géraldine"];
        } else {
            alert("Choississez un genre.");
        }
        name = names[Math.floor(Math.random() * names.length)];
        document.getElementById("character-choice").value = name;
    }

    setCookie("current_text", "start", 1);
    setCookie("name", name, 1);
    setCookie("gender", gender, 1);

    var source = "ressources/profile_pictures/default.jpg";
        if (getCookie("gender") == "male") {
            var i = Math.floor(Math.random() * 5) + 1
            source = `ressources/profile_pictures/man_${i}.jpg`;
        } else if (getCookie("gender") == "female") {
            var i = Math.floor(Math.random() * 15) + 1
            source = `ressources/profile_pictures/woman_${i}.jpg`;
        }
    setCookie("profile_picture", source, 1)
    

    document.getElementById("character-container").style.display = "none";
    document.getElementById("story").style.display = "block";

    loadText();
}

function resumeGame() {
    document.getElementById("start-menu").style.display = "none";
    document.getElementById("story").style.display = "block";
    loadText()
}

function loadText(answer) {
    // Store the content of data.json inside the variable 'json_content'
    getJson().then((json_content) => {
        var text_name = getCookie("current_text");

        // Hide the choice buttons momentarily
        document.getElementById("choice-container").style.display = "none";

        // Display the name and profile picture in the top right-hand corner
        document.getElementById("name").innerHTML = getCookie("name");
        document.getElementById("profile-picture").src = getCookie("profile_picture");
        

        // Define which text to be shown next
        if (text_name == "start") {
            setCookie("current_text", "intro", 1);
            text_name = "intro";
        } else if (json_content[text_name] == undefined) {
            alert(`Impossible d'acceder à json_content[${text_name}]`);
            return false;
        } else {
            if (answer == "answer1") {
                setCookie("current_text", json_content[text_name]["answer_1"][0], 1);
            } else if (answer == "answer2") {
                setCookie("current_text", json_content[text_name]["answer_2"][0], 1);
            }
            text_name = getCookie("current_text");
        }

        // Write the text into '<p id="text"></p>' with a litte animation
        texte = json_content[text_name]["content"];

        if (json_content[text_name]["type"] == "direct") {
            text_name = json_content[text_name]["redirect"];
            setCookie("current_text", text_name, 1);
            texte += json_content[text_name]["content"];
        }

        texte = texte.replace(/NOM/g, getCookie("name")); // Replace all the '[NOM]' by the name chosen by the user
        document.getElementById("text").innerHTML = "";
        var i = 0;
        function afficherTexte(callback) {
            if (i < texte.length) {
                if (document.getElementById("story").style.display == 'none') {
                    return 0
                }
                document.getElementById("text").innerHTML += texte.charAt(i);
                i++;
                setTimeout(function () {
                    afficherTexte(callback);
                }, 30);
            } else {
                callback();
            }
        }
        // Code inside the function will be executed only when the text will be totally shown
        afficherTexte(function () {
            // Display the choice buttons one the text is shown
            document.getElementById("choice-container").style.display = "flex";

            // Replace the text of the choice buttons with the corresponding text
            document.getElementById("choice-1").innerHTML = json_content[text_name]["answer_1"][1];
            document.getElementById("choice-2").innerHTML = json_content[text_name]["answer_2"][1];
        });
    });
}

window.addEventListener('load', onPageLoad()) 
