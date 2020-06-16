const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('matchstats.db');

function createDB() {
    db.run(`CREATE TABLE if not exists match_stats (
        MatchID INTEGER PRIMARY KEY,
        Date date,
        TimeRecorded time,
        Map varchar(255),
        Mode varchar(255),
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

createDB()

function addRow(formData) {
    db.serialize(function() {
        let d = new Date();
        let date = d.getFullYear() + "-" + ('0' + (d.getMonth()+1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
        let time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var sql = `INSERT INTO match_stats (MatchID, Date, TimeRecorded, Map, Mode, Legend, Season, FinalPlace, Kills, Damage, TimeSurvived, Revives)
        VALUES (null, '` + date + `', '` + time + `', '` + formData["map"] + `', '` + formData["mode"] + `', '` + formData["legend"] +`', '` + formData["season"] + `', '` + formData["final-place"] + `', '` + formData["kills"] + `', '` + formData["damage"] + `', '` + formData["time-survived"] + `', '` + formData["revives-given"] + `');`
        db.run(sql)
        console.log("row added: " + sql);
    });
}

ipcRenderer.on('sqlQuery-reply', function (e, rows) {
    if(document.getElementById('player-data') != null) {
        document.getElementById('player-data').parentElement.removeChild(document.getElementById('player-data'))
    }
    let idList = []
    if(rows.length != 0) {
        let dataList = []
        
        let row
        for(let i = 0; i < rows.length; i++) {
            row = rows[i]
            idList.push(row.MatchID)
            rowList = [row.Date, row.Map, row.Mode, row.Legend, row.FinalPlace, row.Kills, row.Damage, row.TimeSurvived]
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

    var headerRow = document.getElementById('player-data').rows[0]
    for(let i = 0; i < headerRow.cells.length; i++) {
        headerRow.cells[i].addEventListener('click', e => {
            
            document.getElementById('sort-by').selectedIndex = i
            
            sortByOptions()
        })
    }
    
    for(let i = 1; i < table.rows.length; i++) {
        console.log("adding listeners...")
        table.rows[i].addEventListener('click',  e => {
            var query = "SELECT * FROM match_stats WHERE MatchID=" + idList[i-1]
            ipc.send('getRow', query)
        })
    }
})

ipcRenderer.on('sqlRow', function (e, row) {
    console.log(row[0])
    ipc.send('matchOverview', row[0])
})


function createTable(tableData) {
    var table = document.createElement('table')
    var headerList = ["Date", "Map", "Mode", "Legend", "Place", "Kills", "Damage", "Time Survived"]
    var headerRow = document.createElement('tr')
    for(let i = 0; i < headerList.length; i++) {
        var headerCell = document.createElement('th')
        headerCell.appendChild(document.createTextNode(headerList[i]))
        headerRow.appendChild(headerCell)
    }
    table.appendChild(headerRow)

    var colList = ["Date", "Map", "Mode", "Legend", "FinalPlace", "Kills", "Damage", "TimeSurvived"]

    tableData.forEach(function (rowData) {
        var row = document.createElement('tr')
        let index = 0
        rowData.forEach(function (cellData) {
            var cell = document.createElement('td')
            if(cellData == null) {
                cellData = "N/A"
            }
            cell.appendChild(document.createTextNode(cellData))
            if(colList[index] === sortBySelect.options[sortBySelect.selectedIndex].value) {
                cell.style.backgroundColor = "rgba(255, 128, 128, 0.25)"
                console.log("row correct...")
            }
            row.appendChild(cell)
            index++
        })

        table.appendChild(row)
    })
    return table
}

//Order html selects
var sortBySelect = document.getElementById('sort-by')
var ascSelect = document.getElementById('asc-select')
var seasonSortSelect = document.getElementById('sort-season')
var modeSortSelect = document.getElementById('sort-mode')

//Build sql query from order options
function sortByOptions () {
    var season = seasonSortSelect.options[seasonSortSelect.selectedIndex].value
    console.log("Season is " + season)

    var mode = modeSortSelect.options[modeSortSelect.selectedIndex].value
    console.log("Mode is " + mode)

    var orderParam = sortBySelect.options[sortBySelect.selectedIndex].value
    console.log("Order by " + orderParam)

    var ascSort = ascSelect.options[ascSelect.selectedIndex].value

    // Change order text to clarify for category
    if(orderParam == "Legend" || orderParam == "Map" || orderParam == "Mode") {
        document.getElementById('option-desc').innerHTML = "Z to A"
        document.getElementById('option-asc').innerHTML = "A to Z"
    } else if (orderParam == "Date") {
        document.getElementById('option-desc').innerHTML = "Recent to Old"
        document.getElementById('option-asc').innerHTML = "Old to Recent"
    } else {
        document.getElementById('option-desc').innerHTML = "High to Low"
        document.getElementById('option-asc').innerHTML = "Low to High"
    }
    
    let query = "SELECT * FROM match_stats"
    if (season != "All" && mode != "All") {
        query += " WHERE Season=" + season
        query += " AND Mode=" + "'" + mode + "'"
    }
    else if (season!= "All") {
        query += " WHERE Season=" + season
    }
    else if (mode != "All") {
        query += " WHERE Mode=" + "'" + mode + "'"
    }
    query += " ORDER BY " + orderParam

    if(orderParam == "Legend") { query = query.concat(" COLLATE NOCASE ")}
    query = query.concat(" " + ascSort)
    if(orderParam == "Date") { query = query.concat(", TimeRecorded " + ascSort)}

    console.log("Sending query: " + query)
    ipc.send('sqlQuery', query)
}


