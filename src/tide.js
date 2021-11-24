class Tide {

    static #BASE_URL = 'https://agw-prod.myutr.com/api/v1'

    static getData = async () => {

        const time = new Date().getTime()
        console.log('Last called Tide api ' + Math.round((time - localStorage.getItem('tide_last_call')) / 1000 / 60) + ' minutes ago')
        if(time - JSON.parse(localStorage.getItem('tide_last_call')) < 5 * 60 * 1000) return JSON.parse(localStorage.getItem('tide'))

        try {
            var options = {
                method: 'GET',
                url: 'https://tides.p.rapidapi.com/tides',
                params: {longitude: '-96.361167', latitude: '28.657731', interval: '60', duration: '1440' },
                headers: {
                  'x-rapidapi-host': 'tides.p.rapidapi.com',
                  'x-rapidapi-key': 'ab5c7a559emshf33f4b10fd008ccp163501jsnda5dcfb1c82b'
                }
            }
            const res = await axios.request(options)
            localStorage.setItem('tide', JSON.stringify(res.data))
            localStorage.setItem('tide_last_call', time)
            return res.data
              
        } 
        catch(e) { console.error(e) }

    }

    static render = async element => {
        const data = await this.getData()

        const heights = data.heights

        const labelArr = [], heightArr = [] // Arrays for charts
        let minIndex = 0, maxIndex = 0, min = 100, max = -100
        for(let i in heights) {

            heightArr.push(heights[i].height.toFixed(5))

            const hour = new Date(heights[i].datetime).getHours()
            const labelStr = this.getHours(hour) + " " + this.getAmOrPm(hour)
            labelArr.push(labelStr)

            // Find high and low tide
            let height = heights[i].height
            if(height > max) {
                maxIndex = i
                max = height
            }
            if(height < min){
                minIndex = i
                min = height
            } 
        }

        const hightide_hour = new Date(heights[maxIndex].datetime).getHours()
        const lowtide_hour = new Date(heights[minIndex].datetime).getHours()
        element.innerHTML =
        `
        <div class="tide center">
            <i class="fas fa-water"></i>
            <h3>Low Tide: ${this.getHours(lowtide_hour)} ${this.getAmOrPm(lowtide_hour)}</h3>
            <h3>High Tide: ${this.getHours(hightide_hour)} ${this.getAmOrPm(hightide_hour)}</h3>
            <div>
                <canvas id="tideChart"></canvas>
            </div>
        <div>
        `

        this.initChart(labelArr, heightArr)
    }

    static getAmOrPm = hours => {
        return hours >= 12 ? 'PM' : 'AM'
    }
    static getHours = hours => {
        return hours > 12 ? hours-12 : hours
    }

    static initChart = (labelArr, dataArr) => {
        const data = {
            labels: labelArr,
            datasets: [{
              label: 'Tidal Wave Heights',
              backgroundColor: '#169ad3',
              borderColor: '#169ad3',
              data: dataArr,
            }]
        }
        const config = {
            type: 'line',
            data: data,
            options: {
                plugins: {
                  legend: {
                    display: false
                  }
                }
            }
        }
        const myChart = new Chart(
            document.getElementById('tideChart'),
            config
        )
    }


}

export default Tide