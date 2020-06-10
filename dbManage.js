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

function getTable() {
    let sql = 'SELECT * FROM match_stats'
    let data = ""
    db.serialize(function() {
        db.all(sql, [], (err, rows) => {
            if(err) {
                throw err
            }
            rows.forEach((row) => {
                data = data.concat(Object.values(row).toString())
            })
        })
    })
}

if(document.getElementById('get-table') != null) {
    document.getElementById('get-table').addEventListener('click', function (e) {
        console.log('fetching data...')
        ipc.send('getTable')
        
    })
}


function createTable(tableData) {
    var table = document.createElement('table')
    var headerList = ["Match", "Date", "Legend", "Season", "Place", "Kills", "Damage", "Time Survived", "Revives"]
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

ipcRenderer.on('getTable-reply', function (e, d) {
    console.table(d)
    if(document.getElementById('player-data') != null) {
        document.getElementById('player-data').parentElement.removeChild(document.getElementById('player-data'))
    }
    var table = createTable(d)
    
    table.id = "player-data"
    
    document.getElementById('data-display').parentNode.insertBefore(table, document.getElementById('data-display'))
    
})
