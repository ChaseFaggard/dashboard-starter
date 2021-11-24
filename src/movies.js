class Movies {
    
    static getData = async () => {
        const options = {
            method: 'GET',
            url: 'https://data-imdb1.p.rapidapi.com/movie/order/upcoming/',
            params: {page_size: '20'},
            headers: {
              'x-rapidapi-host': 'data-imdb1.p.rapidapi.com',
              'x-rapidapi-key': 'ab5c7a559emshf33f4b10fd008ccp163501jsnda5dcfb1c82b'
            }
          }
          
        const res = await axios.request(options)
        return res.data
    }

    static render = async element => {
        const data = await this.getData()
        let html = ``;
        
        // Sort by date
        let byDate = data.results.slice(0)
        byDate.sort(function(a, b) {
            return new Date(a.release) - new Date(b.release)
        })

        // Add each to table
        byDate.forEach(item => {
            html += 
            `<tr>
                <td>${item.title}</td>
                <td>${item.release}</td>
            </tr>`
        })
        element.innerHTML =
        `
        <table class="movie-table">
            <tr>
                <th>Upcoming Movies</th>
                <th>Date</th>
            </tr>
            ${html}
        </table>
        `
    }
}

export default Movies