import Database from "./database.js"

class Weather {

    static getData = async () => {
        const time = new Date().getTime()
        console.log('Last called weather api ' + Math.round((time - localStorage.getItem('weather_last_call')) / 1000 / 60) + ' minutes ago')
        if(time - JSON.parse(localStorage.getItem('weather_last_call')) < 1 * 60 * 1000) return JSON.parse(localStorage.getItem('weather'))
        
        const user = await Database.getRecord('dashboard-users', 'email', localStorage.getItem('email'))
        const location = user.location ? user.location : 'London, UK'
        const options = {
            method: 'GET',
            url: 'https://community-open-weather-map.p.rapidapi.com/weather',
            params: {
              q: location,
              lat: '0',
              lon: '0',
              id: '2172797',
              lang: 'null',
              units: 'imperial'
            },
            headers: {
              'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
              'x-rapidapi-key': 'ab5c7a559emshf33f4b10fd008ccp163501jsnda5dcfb1c82b'
            }
        }
        const response = await axios.request(options)
        localStorage.setItem('weather', JSON.stringify(response.data))
        localStorage.setItem('weather_last_call', time)
        return response.data
    }

    static render = async element => {
        const data = await this.getData()
        const temp = Math.round(data.main.temp)
        element.innerHTML =
        `
        <div class="weather center">
            <i class="fas fa-cloud"></i>
            <h1>${temp}°</h1>
            <h3>${data.name}</h3>
        <div>
        `
    }

}

export default Weather