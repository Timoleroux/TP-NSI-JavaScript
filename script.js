function confirmCharactere() {
    var name = document.getElementById('charactere-name').value;
    var gender = document.querySelector('input[name="gender-choice"]:checked').value;
    document.getElementById('name').innerHTML = name
    if (name) {
        return [name, gender]
    } else {
        name = "Jean-Dominique" // Générer un nom aléatoire
        return name, gender
    }
}


function getChoice() {
    var choice = document.querySelector('input[name="answer-choice"]:checked').value;
    if (choice) {
        document.getElementById("choice-button").style.display = "none";
        displayScript(1, choice)
    }
}

function displayScript(script_id, choice) {
    current_html = document.getElementById('story').innerHTML;
    new_html = current_html + `
    <div class="script-container">
        <p class="script">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis id quas perspiciatis quis assumenda nesciunt recusandae laudantium tempore dolorum possimus commodi, sapiente, magni repudiandae quisquam praesentium. Aliquam minima quod expedita!
        </p>
        <div id="answer">
            <input type="radio" name="answer-choice" value="answer-1" id="answer-1"> Réponse 1
            <input type="radio" name="answer-choice" value="answer-2" id="answer-2"> Réponse 2
        </div>
        <button id="choice-button" onclick="getChoice()">Valider</button>
    </div>
    `;
    document.getElementById('story').innerHTML = new_html;
}