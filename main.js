const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = electron;

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('matchstats.db');

let mainWindow;
let addWindow;

// LIsten for app to be ready
app.on('ready', function() {
    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width:600,
        height:1600,
        minWidth:600,
        frame: false,
        icon: __dirname + '/images/app_icon_64.png',
    });
    // Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    // Quit app when window closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});


// Use window buttons
ipcMain.on('toggleMax', function(e){
    if(!mainWindow.isMaximized()) {
        mainWindow.maximize()
    } else {
        mainWindow.unmaximize()
    }
});

ipcMain.on('minimize', function(e) {
    mainWindow.minimize()
})

ipcMain.on('close', function(e){
    mainWindow.close()
});

function dateFormat(dateStr) {
    console.log(dateStr)
    const months = ["Jan", "Feb", "Mar", "Apr", "June", "July", "Aug", "Sept", "Oct", "Dec"]
    var year = dateStr.substring(0, 4)
    var month = parseInt(dateStr.substring(6, 8))
    var day = dateStr.substring(9)

    return months[month-1] + " " + day
}

//return SQL query
ipcMain.on('sqlQuery', (e, sql) => {
    console.log(sql)
    db.serialize(function() {
        db.all(sql, [], (err, rows) => {
            if(err) {
                throw err
            }
            /* rows.forEach((row) => {
                data.push([row.MatchID, row.Date, row.Legend, row.Season, row.FinalPlace, row.Kills, row.Damage, row.TimeSurvived, row.Revives])
            }) */
            console.log('returning query')
            e.sender.send('sqlQuery-reply', rows)
        })

    })
})

// Create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Add Entry',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Entries'
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}