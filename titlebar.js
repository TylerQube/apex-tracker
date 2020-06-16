var electron = require('electron')
var ipc = electron.ipcRenderer
var remote = electron.remote
var win = remote.BrowserWindow.getFocusedWindow()
var url = require('url');
var path = require('path');

//ipcRenderer events to control window
document.getElementById('nav-min').addEventListener('click', e => {
    e.preventDefault()
    var win = remote.BrowserWindow.getFocusedWindow()
    win.minimize()
})

// Update maximize icon
const maxImg = document.getElementById('max-img')
//call check function when window is moved
win.on('maximize', function (e) {
    maxImg.src = "images/icon_normalscreen.png"
})

win.on('unmaximize', function (e) {
    maxImg.src = "images/icon_fullscreen.png"
})

document.getElementById('nav-max').addEventListener('click', e => {
    e.preventDefault()
    var win = remote.BrowserWindow.getFocusedWindow()
    if(maxImg.getAttribute("src") == "images/icon_fullscreen.png") {
        maxImg.src = "images/icon_normalscreen.png"
    } else {
        maxImg.src = "images/icon_fullscreen.png"
    }
    win.isMaximized() ? win.unmaximize() : win.maximize()
    console.log("clicked")
})

document.getElementById('nav-close').addEventListener('click', e => {
    e.preventDefault()
    var win = remote.BrowserWindow.getFocusedWindow()
    win.close()
})