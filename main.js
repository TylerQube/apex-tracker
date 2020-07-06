const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, webContents} = electron;

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
        width:1000,
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

ipcMain.on('matchOverview', (e, matchInfo) => {
    matchWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        width:700,
        height:550,
        minWidth:700,
        frame: false,
        icon: __dirname + '/images/app_icon_64.png',
    });

    matchWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'matchSummary.html'),
        protocol:'file:',
        slashes: true
    }));

    matchWindow.webContents.on('did-finish-load', () => {
        console.log("sending")
        console.log(matchInfo)
        matchWindow.webContents.send('match-overview', matchInfo)
    })
    
})

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
    db.serialize(function() {
        console.log("Receiving query: " + sql)
        db.all(sql, [], (err, rows) => {
            if(err) {
                throw err
            }
            console.log('returning results')
            e.sender.send('sqlQuery-reply', rows)
        })

    })
})

ipcMain.on('getRow', (e, sql) => {
    db.serialize(function() {
        console.log("Receiving query: " + sql)
        db.all(sql, [], (err, row) => {
            if(err) {
                throw err
            }
            console.log('returning row')
            e.sender.send('sqlRow', row)
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