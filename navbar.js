const ipc = electron.ipcRenderer
const remote = electron.remote
var win = remote.BrowserWindow.getFocusedWindow()
const url = require('url');
const path = require('path');

const menuMin = document.getElementById('nav-min')

const dataPage = document.getElementById('data-page')
const formPage = document.getElementById('form-page')

dataPage.style.display = "none"

const pages = [formPage, dataPage]

//handles navigation bar highlighting
document.querySelectorAll('.nav-button').forEach(item => {
    item.addEventListener("click", e => {
        let buttons = document.getElementsByClassName('clicked-nav');
        if (buttons.length != 0) {
            for(let i = 0; i < buttons.length; i++) {
                buttons[i].classList.add('unclicked-nav');
                buttons[i].classList.remove('clicked-nav');
            }
        }
        if(item.id == 'nav-form') {
            for(let i = 0; i < pages.length; i++) {
                pages[i].style.display = "none"
            }
            formPage.style.display = "block"
        } else if(item.id == 'nav-data') {
            for(let i = 0; i < pages.length; i++) {
                pages[i].style.display = "none"
            }
            dataPage.style.display = "block"
            ipc.send('getTable')
        }

        item.classList.add('clicked-nav');
        item.classList.remove('unclicked-nav');

        
        console.log("nav clicked.");
    });
});


//ipcRenderer events to control window
document.getElementById('nav-min').addEventListener('click', e => {
    e.preventDefault()
    ipc.send('minimize')
})

// Update maximize icon
const maxImg = document.getElementById('max-img')

//Update based on manual maximization
function checkMax() {
    if(win.isMaximized()) {
        maxImg.src = "images/icon_normalscreen.png"
    } else {
        maxImg.src = "images/icon_fullscreen.png"
    }
}
//call check function when page is opened
checkMax()
//call check function when window is moved
win.on('move', function (e) {
    checkMax()
})


document.getElementById('nav-max').addEventListener('click', e => {
    e.preventDefault()
    console.log(maxImg.src)
    if(maxImg.getAttribute("src") == "images/icon_fullscreen.png") {
        maxImg.src = "images/icon_normalscreen.png"
    } else {
        maxImg.src = "images/icon_fullscreen.png"
        console.log("what")
    }
    ipc.send('toggleMax')
    console.log("clicked")
})

document.getElementById('nav-close').addEventListener('click', e => {
    e.preventDefault()
    ipc.send('close')
})
