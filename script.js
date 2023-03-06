function getJson() {
    return fetch("data.json")
        .then((response) => response.json())
        .catch((error) => console.error("Error:", error));
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

function start() {
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

    document.getElementById("start-btn").style.display = "none";
    document.getElementById("character-choice").disabled = true;
    document.getElementById("male").disabled = true;
    document.getElementById("female").disabled = true;

    loadText();
}

function loadText() {
    getJson().then((json_content) => {
        current_html = document.getElementById("story").innerHTML;
        var text_name = getCookie("current_text");

        if (text_name == "start") {
            setCookie("current_text", "intro", 1);
            text_name = "intro";
        } else if (json_content[text_name] == undefined) {
            alert(`Impossible d'acceder à json_content[${text_name}]`);
            return false;
        } else {
            if (document.getElementById(`choice-${text_name}-1`).checked) {
                setCookie("current_text", json_content[text_name]["answer_1"][0], 1);
            } else if (document.getElementById(`choice-${text_name}-2`).checked) {
                setCookie("current_text", json_content[text_name]["answer_2"][0], 1);
            } else {
                return false;
            }
            text_name = getCookie("current_text");
        }

        // Get the new html according to the type of data
        if (json_content[text_name]["type"] == "question") {
            new_html =
                current_html + `
                <div class="scene-container">
                    <p class="scene">${json_content[text_name]["content"]}</p>
                    <label>
                    <input type="radio" name="answer-choice-${text_name}" id="choice-${text_name}-1" value="answer-1"> ${json_content[text_name]["answer_1"][1]}
                    </label>
                    <label>
                    <input type="radio" name="answer-choice-${text_name}" id="choice-${text_name}-2" value="answer-2"> ${json_content[text_name]["answer_2"][1]}
                    </label>
                    <button id="confirm-choice-button-${text_name}">Valider</button>
                </div>`;
        } else if (json_content[text_name]["type"] == "random"){
            alert("random")
        } else if (json_content[text_name]["type"] == "direct"){
            var redirect_text = json_content[text_name]["redirect"]
            new_html =
                current_html + `
                <div class="scene-container">
                    <p class="scene">${json_content[text_name]["content"]}</p>
                    <p class="scene">${json_content[redirect_text]["content"]}</p>
                    <input type="radio" name="answer-choice-${redirect_text}" id="choice-${redirect_text}-1" value="answer-1"> ${json_content[redirect_text]["answer_1"][1]}
                    <input type="radio" name="answer-choice-${redirect_text}" id="choice-${redirect_text}-2" value="answer-2"> ${json_content[redirect_text]["answer_2"][1]}
                    <button id="confirm-choice-button-${redirect_text}">Valider</button>
                </div>`;
            text_name = redirect_text
        } else {
            alert("unknown")
        }

        document.getElementById("story").innerHTML = new_html;
        document.getElementById("name").innerHTML = getCookie("name");

        // Run 'loadText()' when 'confirm-choice-button-${text_name}' is clicked
        document.getElementById(`confirm-choice-button-${text_name}`).addEventListener("click", () => {
            loadText();
        });
    });
}
