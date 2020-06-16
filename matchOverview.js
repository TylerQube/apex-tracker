const { ipcRenderer } = require("electron")


var legImg = document.getElementById('legend-pic')


ipcRenderer.on('match-overview', function (event, matchInfo) {
    var statsContainer = document.getElementById('stats-container')
    if ( matchInfo.Map == "World's Edge") {
        document.body.style.backgroundImage = "url(./images/worlds_edge.jpg)"
    } else if ( matchInfo.Map == "King's Canyon" ) {
        document.body.style.backgroundImage = "url(./images/kings_canyon.jpg)"
    }
    document.body.style.backgroundSize = "100%"
    statsContainer.innerHTML = matchInfo.Legend + "<br/>Final Place: " + matchInfo.FinalPlace + "<br/>Kills: " + matchInfo.Kills + "<br/>Damage: " + matchInfo.Damage + "<br/>Revives: " + matchInfo.Revives  
    console.log(matchInfo.Legend)
    legImg.src = "./images/full_legends/" + matchInfo.Legend + ".jpg"
})