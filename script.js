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

script_id = 0;
function getChoice() {
    var choice = document.querySelector(`input[name="answer-choice-${script_id}"]:checked`).value;
    if (choice) {
        //  Permet que les radios button ne se décochent pas après qu'on ait validé la réponse
        document.querySelector(`input[name="answer-choice-${script_id}"]:checked`).setAttribute("checked", "checked");
        document.getElementById(`confirm-choice-button-${script_id}`).style.display = "none";
        script_id = script_id + 1;
        displayScript(script_id, choice);
    }
}

function displayScript(script_id, choice) {
    current_html = document.getElementById("story").innerHTML;
    new_html =
        current_html +
        `
    <div class="scene-container">
        <p class="scene">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis id quas perspiciatis quis assumenda nesciunt recusandae laudantium tempore dolorum possimus commodi, sapiente, magni repudiandae quisquam praesentium. Aliquam minima quod expedita!
        </p>
        <div>
            <input type="radio" name="answer-choice-${script_id}" value="answer-1"> Réponse 1
            <input type="radio" name="answer-choice-${script_id}" value="answer-2"> Réponse 2
        </div>
        <button id="confirm-choice-button-${script_id}" onclick="getChoice()">Valider</button>
    </div>
    `;
    document.getElementById("story").innerHTML = new_html;
}
