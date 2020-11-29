const { ipcRenderer, session } = require("electron")
const { stat } = require("fs")
const { match } = require("assert")


var legImg = document.getElementById('legend-pic')


ipcRenderer.on('match-overview', function (event, matchInfo) {
    
    var statsContainer = document.getElementById('stats-container')
    if ( matchInfo.Map == "World's Edge") {
        document.body.style.backgroundImage = "url(./images/worlds_edge.jpg)"
    } else if ( matchInfo.Map == "King's Canyon" ) {
        document.body.style.backgroundImage = "url(./images/kings_canyon.jpg)"
    }
    document.body.style.filter = "blure(8px)"
    document.getElementById('window-header').innerHTML = "Match Summary: " + matchInfo.Date
    document.body.style.backgroundAttachment = "fixed"
    document.body.style.backgroundSize = "cover"
    document.body.style.backgroundRepeat = "no-repeat"

    document.getElementById('legend-name').innerHTML = matchInfo.Legend

    document.getElementById('date-header').innerHTML = matchInfo.Date + " at " + matchInfo.TimeRecorded
    document.getElementById('season-header').innerHTML = "Season " + matchInfo.Season
    document.getElementById('map').innerHTML = matchInfo.Map 
    document.getElementById('mode').innerHTML = matchInfo.Mode
    document.getElementById('final-place').innerHTML = matchInfo.FinalPlace
    document.getElementById('kills').innerHTML = matchInfo.Kills
    document.getElementById('damage').innerHTML = matchInfo.Damage
    document.getElementById('revives').innerHTML = matchInfo.Revives

    legImg.src = "./images/full_legends/" + matchInfo.Legend + ".png"
})