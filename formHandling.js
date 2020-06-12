const electron = require('electron')
const { dialog } = require('electron').remote;
const {ipcRenderer} = electron;

ipcRenderer.on('item:add', function(e, item){
    const li = document.createElement('li');
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});

//define submit button
const submitButton = document.getElementById('submit-button');

//validates form on submit and creates json
submitButton.addEventListener('click', function(event) {
    //prevents propagation
    event.preventDefault();
    //true if missing required fields
    let incomplete = false;
    const invalidOutline = "4px solid rgba(255, 0, 0, 0.7)";
    //iterate through radio buttons to find selected
    const legendRadios = document.getElementsByName('legend');
    let legendPicked = false;
    let legend;
    for(let i = 0; i < legendRadios.length; i++) {
        if(legendRadios[i].checked) {
            legendPicked = true;
            legend = legendRadios[i].value;
        } 
    }
    if(!legendPicked) {
        incomplete = true;
        document.getElementById('legend-container').style.outline = invalidOutline;
        console.log("no legend selected");
    }
    //check season
    const seasonInput = document.getElementById("season-input");
    let season;
    if(seasonInput.checkValidity()) {
        season = seasonInput.value;
    } else {
        incomplete = true;
        console.log("changing placeholder...");
        seasonInput.style.outline = invalidOutline;
    }
    //check final place
    const placeInput = document.getElementById("place-input");
    let place;
    if(placeInput.checkValidity()) {
        place = placeInput.value;
    } else {
        incomplete = true;
        console.log("final place invalid");
        placeInput.style.outline = invalidOutline;
    }
    //check kills
    const killsInput = document.getElementById("kills-input");
    let kills;
    if(killsInput.checkValidity()) {
        kills = killsInput.value;
    } else {
        incomplete = true;
        console.log("kills invalid");
        killsInput.style.outline = invalidOutline;
    }
    //check damage 
    const damageInput = document.getElementById("damage-input");
    let damage;
    if(damageInput.checkValidity()) {
        damage = damageInput.value;
    } else {
        incomplete = true;
        console.log("damage invalid");
        damageInput.style.outline = invalidOutline;
    }

    //check time survived
    const minInput = document.getElementById("minutes-input");
    const secInput = document.getElementById("seconds-input");
    let timeSurvived;
    if(minInput.checkValidity() && secInput.checkValidity()) {
        let minSurvived = minInput.value;
        let secSurvived = secInput.value;
        if(minInput.value.length == 1) {
            minSurvived = "0" + minSurvived;
        }
        if(secInput.value.length == 1) {
            secSurvived = "0" + secSurvived;
        }
        timeSurvived = "00:" + minSurvived + ":" + secSurvived; 
    } 
    if(!minInput.checkValidity()) {
        incomplete = true;
        console.log("minutes invalid");
        minInput.style.outline = invalidOutline;
    } 
    if(!minInput.checkValidity()) {
        incomplete = true;
        console.log("seconds invalid");
        secInput.style.outline = invalidOutline;
    }
    //check revives given
    const revivesInput = document.getElementById("revives-input");
    let revivesGiven;
    if(revivesInput.checkValidity()) {
        revivesGiven = revivesInput.value;
    } else {
        incomplete = true;
        console.log("revives invalid");
        revivesInput.style.outline = invalidOutline;
    }
    //evaluate if form is completed
    if(incomplete) {
        document.getElementById('json-display').style.fontSize = "80%";
        document.getElementById('json-display').innerHTML = "Form Incomplete...";
        return;
    } else {
        console.log("form submitting...");
        //create json to be submitted
        let formData = {
            "legend":legend,
            "season":Number(season),
            "final-place":Number(place),
            "kills":Number(kills),
            "damage":Number(damage),
            "time-survived":timeSurvived,
            "revives-given":Number(revivesGiven)
        }
        createDB();
        addRow(formData);
        getTable();
        resetForm();   
    }
    
});

//reset form outlines
function resetForm() {
    document.getElementById('apex-form-header').reset();
    const inputs = document.getElementsByTagName('input');
    document.getElementById('json-display').style.fontSize = "80%";
    document.getElementById('json-display').innerHTML = "Form Reset!";
    document.getElementById('legend-container').style.outline = "0px";
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].type == "text" || inputs[i].type == "number") {
            inputs[i].style.outlineWidth = "0px";
        }
    }
}