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
    console.log("start logging");
    let sql = 'SELECT * FROM match_stats'
    db.all(sql, [], (err, rows) => {
        if(err) {
            throw err;
        }

        rows.forEach((row) => {
            console.log(row);
        });
    });
    console.log("done logging.")
}
