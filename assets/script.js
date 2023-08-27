window.addEventListener("load", function(event){
    console.log('window is loaded')

    var fetchButton = document.getElementById('fetch-data')
    var displayedData = document.getElementById('fetchedData')
    var resetButton = document.getElementById('resetPage')

    function getData() {
        displayedData.textContent = ''
        var cityInput = document.getElementById('cityName')
        var stateInput = document.getElementById('stateName')
        var cityName = cityInput.value
        var stateName = stateInput.value
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
                    var requestUrlToday = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=48b446f840f21fe274c2224a206ddfc4&units=imperial`
                    var requestUrlMulDay = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=48b446f840f21fe274c2224a206ddfc4&units=imperial`
                        fetch(requestUrlMulDay)
                            .then(function (response){
                                console.log('weather response', response)
                                return response.json()
                            }) 
                            .then (function (data){
                                console.log('mul day weather data', data)
                                var mulDayForecast = data
                                createForecast(mulDayForecast)
                            })
                        fetch(requestUrlToday)
                            .then(function (response){
                                console.log('today weather response', response)
                                return response.json()
                            })
                            .then (function (data){
                                console.log('today weather data', data)
                                var todayForecast = data
                                createTodayForecast(todayForecast)
                            })
        cityInput.value = ""
        stateInput.value = ""
    })}

    function createForecast(mulDayForecast) {
        console.log('running createForecast with this data:', mulDayForecast)
        for (var i = 0; i < mulDayForecast.list.length; i++) {
            var unconvertDate = mulDayForecast.list[i].dt
            var dayDate = convertTimestamptoDate(unconvertDate)
            var dayTime = convertTimestamptoTime(unconvertDate)
            
            if (dayTime === '10:00 AM') {
                var dayCard = document.createElement('card')
                var dayDateEl = document.createElement('h3')
                var weatherIcon = document.createElement('img')
                var dayTemp = document.createElement('p')
                var dayHumidity = document.createElement('p')
                var dayWind = document.createElement('p')

                console.log('icon code', mulDayForecast.list[i].weather[0].icon)
                var iconCode = mulDayForecast.list[i].weather[0].icon

                dayCard.setAttribute('class', 'card  col-12 col-md-6 col-lg-3')
                dayDateEl.setAttribute('class', 'card-title')
                dayTemp.setAttribute('class', 'card-text')
                dayHumidity.setAttribute('class', 'card-text')
                dayWind.setAttribute('class', 'card-text')
                weatherIcon.src = `http://openweathermap.org/img/w/${iconCode}.png`

                dayDateEl.textContent = `Date: ${dayDate}`
                dayTemp.textContent = `High Of: ${mulDayForecast.list[i].main.temp_max}`
                dayHumidity.textContent = `Humidity: ${mulDayForecast.list[i].main.humidity}`
                dayWind.textContent = `Wind Speed: ${mulDayForecast.list[i].wind.speed}`

                dayCard.append(weatherIcon, dayDateEl, dayTemp, dayHumidity, dayWind)
                displayedData.append(dayCard) 
            }     
        }
    }

    function createTodayForecast(todayForecast) {
        console.log('running createtodayforecast')
        
        var todayCard = document.createElement('card')
        var dayDateEl = document.createElement('h3')
        var weatherIcon = document.createElement('p')
        var dayTemp = document.createElement('p')
        var dayHumidity = document.createElement('p')
        var dayWind = document.createElement('p')

        // getWeatherIcon(weatherIcon)

        var unconvertDate = todayForecast.dt
        var dayDate = convertTimestamptoDate(unconvertDate)
        
        todayCard.setAttribute('class', 'card  col-12 col-md-6 col-lg-3')
        dayDateEl.setAttribute('class', 'card-title')
        dayTemp.setAttribute('class', 'card-text')
        dayHumidity.setAttribute('class', 'card-text')
        dayWind.setAttribute('class', 'card-text')

        dayDateEl.textContent = `Date: ${dayDate}`
        dayTemp.textContent = `High Of: ${todayForecast.main.temp}`
        dayHumidity.textContent = `Humidity: ${todayForecast.main.humidity}`
        dayWind.textContent = `Wind Speed: ${todayForecast.wind.speed}`

        todayCard.append(dayDateEl, dayTemp, dayHumidity, dayWind)
        displayedData.append(todayCard)
    }

    // function getWeatherIcon(weatherIcon) {
    //     var weatherIcon = document.createElement('p')
    //     if (mulDayForecast.list[i].weather[0].main.icon == "Clouds") {
    //         weatherIcon.textContent = ''
    //     } else if (mulDayForecast.list[i].weather[0].main == "Clear") {
    //         weatherIcon.textContent = ''
    //     } else if (mulDayForecast.list[i].weather[0].main == "") {
    //         weatherIcon.textContent = ''
    //     } else if (mulDayForecast.list[i].weather[0].main == "") {
    //         weatherIcon.textContent = ''
    //     }
    // }

    function convertTimestamptoDate(timestamp) {
        var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.

        convertedDate = mm + '-' + dd  + '-' + yyyy
        return convertedDate;
    }

    function convertTimestamptoTime(timestamp) {
        var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
            ampm = 'AM',
            time;
        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }
        convertedTime = h + ':' + min + ' ' + ampm
        return convertedTime;
    }

    fetchButton.addEventListener('click', getData)
})
