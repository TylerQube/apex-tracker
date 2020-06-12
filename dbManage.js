const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('matchstats.db');

function createDB() {
    db.run(`CREATE TABLE if not exists match_stats (
        MatchID INTEGER PRIMARY KEY,
        Date date,
        TimeRecorded time,
        Legend varchar(255),
        Season int,
        FinalPlace int,
        Kills int,
        Damage int,
        TimeSurvived time,
        Revives int
    );`);
    console.log("DB created");
}

function addRow(formData) {
    db.serialize(function() {
        let d = new Date();
        let date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        db.run(`INSERT INTO match_stats (MatchID, Date, TimeRecorded, Legend, Season, FinalPlace, Kills, Damage, TimeSurvived, Revives)
                VALUES (null, '` + date + `', '` + time + `', '` + formData["legend"] +`', '` + formData["season"] + `', '` + formData["final-place"] + `', '` + formData["kills"] + `', '` + formData["damage"] + `', '` + formData["time-survived"] + `', '` + formData["revives-given"] + `');`)
        console.log("row added.");
    });
}

if(document.getElementById('get-table') != null) {
    document.getElementById('get-table').addEventListener('click', function (e) {
        console.log('fetching data...')
        ipc.send('sqlQuery', 'SELECT * FROM match_stats')
        
    })
}

ipcRenderer.on('sqlQuery-reply', function (e, rows) {
    if(document.getElementById('player-data') != null) {
        document.getElementById('player-data').parentElement.removeChild(document.getElementById('player-data'))
    }
    if(rows.length != 0) {
        let dataList = []
        let row
        for(let i = 0; i < rows.length; i++) {
            row = rows[i]
            let rowList = [row.Date, row.Legend, row.Season, row.FinalPlace, row.Kills, row.Damage, row.TimeSurvived, row.Revives]
            console.log(rowList)
            dataList.push(rowList)
        }
        var table = createTable(dataList)
    } else {
        var table = document.createElement('table')
        var header = document.createElement('th')
        header.appendChild(document.createTextNode('No matches found...'))
        table.appendChild(header)
    }
    table.id = "player-data"
    document.getElementById('data-display').appendChild(table)
})


function createTable(tableData) {
    var table = document.createElement('table')
    var headerList = ["Date", "Legend", "Season", "Place", "Kills", "Damage", "Time Survived", "Revives"]
    var headerRow = document.createElement('tr')
    for(let i = 0; i < headerList.length; i++) {
        var headerCell = document.createElement('th')
        headerCell.appendChild(document.createTextNode(headerList[i]))
        headerRow.appendChild(headerCell)
    }
    table.appendChild(headerRow)

    
    tableData.forEach(function (rowData) {
        var row = document.createElement('tr')
        rowData.forEach(function (cellData) {
            var cell = document.createElement('td')
            cell.appendChild(document.createTextNode(cellData))
            row.appendChild(cell)
        })

        table.appendChild(row)
    })
    return table
}

var sortBySelect = document.getElementById('sort-by')
var seasonSortSelect = document.getElementById('sort-season')
var ascSelect = document.getElementById('asc-select')
function sortByOptions () {
    var season = seasonSortSelect.options[seasonSortSelect.selectedIndex].value
    console.log("Season is " + season)

    var orderParam = sortBySelect.options[sortBySelect.selectedIndex].value
    console.log("Order by " + orderParam)
    
    let query = "SELECT * FROM match_stats"
    if (season != "All") {
        query = query.concat(" WHERE Season=").concat(season)
    }

    query = query.concat(" ORDER BY ").concat(orderParam).concat(" ")
    var ascSort = ascSelect.options[ascSelect.selectedIndex].value
    query = query.concat(ascSort)
    /* if(orderParam != "FinalPlace" && orderParam != "Legend") {
        query = query.concat(" DESC")
    } else {
        query.concat(" ASC")
    } */

    console.log(query)
    ipc.send('sqlQuery', query)
}


