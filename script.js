function getJsonContent() {
    return fetch("./data.json")
        .then((response) => response.json())
        .then((json) => {
            return json;
        });
}

getJsonContent()
    .then((json) => {
        return json;
    })
    .catch((error) => {
        alert(`Erreur dans le chargement du fichier json :\n${error}`)
        return error;
    });

function confirmcharacter() {
    var name = document.getElementById("character-choice").value;
    var gender = document.querySelector('input[name="gender-choice"]:checked').value;
    if (!name) {
        if (gender == "male") {
            var names = ["Jean-Dominique", "Florent", "Sébastien"];
        } else {
            var names = ["Marie-Dominique", "Christelle", "Géraldine"];
        }
        name = names[Math.floor(Math.random() * names.length)];
        document.getElementById("character-choice").value = name;
    }
    document.getElementById("name").innerHTML = name;
    return [name, gender];
}

// C'est ici qu'on viendra récupérer le début du texte dans les cookies
var script_name = "introduction";
function getChoice() {
    var choice = document.querySelector(`input[name="answer-choice-${script_name}"]:checked`).value;
    if (choice) {
        //  Permet que les radios button ne se décochent pas après qu'on ait validé la réponse
        document.querySelector(`input[name="answer-choice-${script_name}"]:checked`).setAttribute("checked", "checked");
        document.getElementById(`confirm-choice-button-${script_name}`).style.display = "none";
        script_name = "texte suivant";
        displayScript(script_name, choice);
    }
}

function displayScript(script_name, choice) {
    current_html = document.getElementById("story").innerHTML;
    new_html =
        current_html +
        `
    <div class="scene-container">
        <p class="scene">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis id quas perspiciatis quis assumenda nesciunt recusandae laudantium tempore dolorum possimus commodi, sapiente, magni repudiandae quisquam praesentium. Aliquam minima quod expedita!
        </p>
        <div>
            <input type="radio" name="answer-choice-${script_name}" value="answer-1"> Réponse 1
            <input type="radio" name="answer-choice-${script_name}" value="answer-2"> Réponse 2
        </div>
        <button id="confirm-choice-button-${script_name}" onclick="getChoice()">Valider</button>
    </div>
    `;
    document.getElementById("story").innerHTML = new_html;
}
