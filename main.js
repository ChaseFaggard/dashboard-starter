import Auth from './src/auth.js'
import Database from './src/database.js'
import Weather from './src/weather.js'
import Tide from './src/tide.js'
import Movies from './src/movies.js'
import ToDoList from './src/todolist.js'

const main = async () => {

    renderUI()

}

const renderUI = async () => {
    const container = document.querySelector('.container')
    const authContainer = document.querySelector('.auth-container')

    if(Auth.isAuthenticated()) { // User is logged in - show dashboard
        
        authContainer.style.display = 'none'
        container.style.display = 'grid'
        document.querySelector('.settings').style.display = 'none'

        const dashboardBtn = document.querySelector('#dashboardBtn')
        const settingsBtn = document.querySelector('#settingsBtn')
        const themeBtn = document.querySelector('#themeBtn')
        const logoutBtn = document.querySelector('#logoutBtn')

        const dash = document.querySelector('.main')
        const settings = document.querySelector('.settings')
        
        const user = await getUser()
        document.querySelector('#title').innerText = `${user.first_name}'s Dashboard`
        const locationInput = document.querySelector('#location-input')
        locationInput.value = `${user.location}`
        updateThemeUI(user.theme)

        const spans = document.querySelectorAll('span')
        for(let span of spans) {
            span.addEventListener('click', e => updateTheme(e.target.classList.value))
            if(span.classList.value == user.theme) span.classList.add('active')
        }

        dashboardBtn.addEventListener('click', e => {
            dashboardBtn.classList.add('active')
            settingsBtn.classList.remove('active')
            dash.style.display = 'grid'
            settings.style.display = 'none'
        })

        settingsBtn.addEventListener('click', e => {
            dashboardBtn.classList.remove('active')
            settingsBtn.classList.add('active')
            dash.style.display = 'none'
            settings.style.display = 'block'
        }) 

        themeBtn.addEventListener('click', e => {
            const themePopup = document.querySelector('.theme-popup')
            themePopup.classList.toggle('hide')
        }) 

        logoutBtn.addEventListener('click', e => {
            Auth.logout()
            document.querySelector('.container').style.display = 'none'
            document.querySelector('.auth-container').style.display = 'block'
            Auth.renderLoginForm(document.querySelector('.auth-container'), renderUI)
        })

        document.querySelector('#save-settings').addEventListener('click', async e => {
            user.location = locationInput.value
            await Database.updateRecord('dashboard-users',user)
            
            const weatherUI = document.querySelector('#weather')
            localStorage.setItem('weather_last_call', new Date().getTime() - 100000)
            Weather.render(weatherUI)

            const tideUI = document.querySelector('#tide')
            localStorage.setItem('tide_last_call', new Date().getTime() - 100000)
            Tide.render(tideUI)

            dashboardBtn.classList.add('active')
            settingsBtn.classList.remove('active')
            dash.style.display = 'grid'
            settings.style.display = 'none'
        })
        
        const weatherUI = document.querySelector('#weather')
        const tideUI = document.querySelector('#tide')
        const moviesUI = document.querySelector('#movies')
        const toDoListUI = document.querySelector('#todolist')


        // Render main widgets
        Weather.render(weatherUI)
        Tide.render(tideUI)
        Movies.render(moviesUI)
        ToDoList.render(toDoListUI)
    }

    else { // User is not logged in - show login/signup form
        container.style.display = 'none'
        authContainer.style.display = 'block'
        Auth.renderLoginForm(authContainer, renderUI)
    }
}

const getUser = async () => {
    return await Database.getRecord('dashboard-users','email', localStorage.getItem('email'))
}

const updateTheme = async theme => {
    updateThemeUI(theme)
    const user = await getUser()
    user.theme = theme
    await Database.updateRecord('dashboard-users', user)
}

const updateThemeUI = theme => {
    document.querySelector('.container').classList.value = `container ${theme}`
    const spans = document.querySelectorAll('span')
    for(let span of spans)  {
        if(span.classList.value == theme) span.classList.add('active')
        else span.classList.remove('active')
    }
}

document.addEventListener('DOMContentLoaded', main())