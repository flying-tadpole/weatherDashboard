window.addEventListener("load", function(event){
    console.log('window is loaded')
    var cityInput = document.getElementById('cityName')
    var stateInput = document.getElementById('stateName')
    var cityName = cityInput.value
    var stateName = stateInput.value

    var fetchButton = document.getElementById('fetch-data')
    var displayedData = document.getElementById('fetchedData')
    var resetButton = document.getElementById('resetPage')

    function getData() {
        displayedData.textContent = ''
        var geoRequestUrl = `https://geocode.maps.co/search?city=${cityName}&state=${stateName}`
        fetch(geoRequestUrl)
            .then(function (response) {
                console.log('geo response', response)
                return response.json()
            })
            .then(function (data) {
                console.log('geo data', data)
                    var dataArray = Array.from(data)
                    var latitude = dataArray[0].lat
                    console.log('lat', latitude)
                    var longitude = dataArray[0].lon
                    console.log('lon', longitude)
                    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=48b446f840f21fe274c2224a206ddfc4&units=imperial`
                        fetch(requestUrl)
                            .then(function (response){
                                console.log('weather response', response)
                                return response.json()
                            }) 
                            .then (function (data){
                                console.log('weather data', data)
                                var weatherData = data

                                var mulDayForecast = [weatherData.list[4], weatherData.list[12], weatherData.list[20], weatherData.list[28], weatherData.list[36]]
                                console.log('forecast array?', mulDayForecast)

                                for (var i = 0; i < mulDayForecast.length; i++) {
                                    var dayCard = document.createElement('card')
                                    var dayDateEl = document.createElement('h3')
                                    var dayTemp = document.createElement('p')
                                    var dayHumidity = document.createElement('p')
                                    var dayWind = document.createElement('p')

                                    dayCard.setAttribute('class', 'card  col-12 col-md-6 col-lg-3')
                                    dayDateEl.setAttribute('class', 'card-title')
                                    dayTemp.setAttribute('class', 'card-text')
                                    dayHumidity.setAttribute('class', 'card-text')
                                    dayWind.setAttribute('class', 'card-text')

                                    var unconvertDate = mulDayForecast[i].dt
                                    var dayDate = convertTimestamp(unconvertDate)
                                    
                                    dayDateEl.textContent = `Date: ${dayDate}`
                                    dayTemp.textContent = `High Of: ${mulDayForecast[i].main.temp_max}`
                                    dayHumidity.textContent = `Humidity: ${mulDayForecast[i].main.humidity}`
                                    dayWind.textContent = `Wind Speed: ${mulDayForecast[i].wind.speed}`

                                    dayCard.append(dayDateEl, dayTemp, dayHumidity, dayWind)
                                    displayedData.append(dayCard)
                                }
                            })
    })}

    function convertTimestamp(timestamp) {
        var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.

        convertedDate = mm + '-' + dd  + '-' + yyyy
        return convertedDate;
    }

    fetchButton.addEventListener('click', getData)
})