const { session } = require("electron")

const menuMin = document.getElementById('nav-min')

const dataPage = document.getElementById('data-page')
const formPage = document.getElementById('form-page')
const statsPage = document.getElementById('stats-page')

formPage.style.display = "none"
dataPage.style.display = "none"
statsPage.style.display = "none"


var item = sessionStorage.getItem('openDiv')
let buttons = document.getElementsByClassName('clicked-nav');
if (buttons.length != 0) {
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add('unclicked-nav');
        buttons[i].classList.remove('clicked-nav');
    }
}
console.log(item)
if (item == "form" || item == null) {
    formPage.style.display = "block"
    document.getElementById('nav-form').classList.add('clicked-nav');
    document.getElementById('nav-form').classList.remove('unclicked-nav');
} else if (item == "data") {
    dataPage.style.display = "block"
    document.getElementById('nav-data').classList.add('clicked-nav');
    document.getElementById('nav-data').classList.remove('unclicked-nav');
    createDB()
    console.log("creating db")
    sortByOptions()
} else if (item == "stats") {
    statsPage.style.display = "block"
    document.getElementById('nav-stats').classList.add('clicked-nav');
    document.getElementById('nav-stats').classList.remove('unclicked-nav');
} 

const pages = [formPage, dataPage, statsPage]

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
        for(let i = 0; i < pages.length; i++) {
            pages[i].style.display = "none"
        }
        if(item.id == 'nav-form') {
            formPage.style.display = "block"
            sessionStorage.setItem('openDiv', "form")
        } else if(item.id == 'nav-data') {
            //Open data page
            dataPage.style.display = "block"
            sessionStorage.setItem('openDiv', "data")
            createDB()
            console.log("creating db")
            sortByOptions()
        } else if(item.id == 'nav-stats') {
            statsPage.style.display = "block"
            sessionStorage.setItem('openDiv', "stats")
        }


        item.classList.add('clicked-nav');
        item.classList.remove('unclicked-nav');

        
        console.log("nav clicked.");
    });
});



