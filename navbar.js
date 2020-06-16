const menuMin = document.getElementById('nav-min')

const dataPage = document.getElementById('data-page')
const formPage = document.getElementById('form-page')
const statsPage = document.getElementById('stats-page')

dataPage.style.display = "none"
statsPage.style.display = "none"

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
        if(item.id == 'nav-form') {
            for(let i = 0; i < pages.length; i++) {
                pages[i].style.display = "none"
            }
            formPage.style.display = "block"
        } else if(item.id == 'nav-data') {
            //Open data page
            for(let i = 0; i < pages.length; i++) {
                pages[i].style.display = "none"
            }
            dataPage.style.display = "block"
            createDB()
            console.log("creating db")
            sortByOptions()
        } else if(item.id == 'nav-stats') {
            for(let i = 0; i < pages.length; i++) {
                pages[i].style.display = "none"
            }
            statsPage.style.display = "block"
        }

        item.classList.add('clicked-nav');
        item.classList.remove('unclicked-nav');

        
        console.log("nav clicked.");
    });
});



