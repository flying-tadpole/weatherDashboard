// waits until all elements are loaded before running code
window.addEventListener("load", function(event){
    console.log('window is loaded')

    // identifies elements on page
    var fetchButton = document.getElementById('fetch-data')
    var displayedData = document.getElementById('fetchedData')

    // takes user input and runs API query to get weather data
    function getData() {
        displayedData.textContent = ''
        var cityInput = document.getElementById('cityName')
        var stateInput = document.getElementById('stateName')
        var cityName = cityInput.value
        var stateName = stateInput.value
        saveSearch(cityName, stateName)
        var geoRequestUrl = `https://geocode.maps.co/search?city=${cityName}&state=${stateName}` //used to get lat/lon info
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
                    // used to get TODAY forecast
                    var requestUrlToday = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=48b446f840f21fe274c2224a206ddfc4&units=imperial`
                    // used to get next 5 days forecast
                    var requestUrlMulDay = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=48b446f840f21fe274c2224a206ddfc4&units=imperial`
                        fetch(requestUrlToday)
                            .then(function (response){
                                console.log('today weather response', response)
                                return response.json()
                            })
                            .then (function (data){
                                console.log('today weather data', data)
                                var todayForecast = data
                                createTodayForecast(todayForecast) //sends data for today forecast
                            })
                        fetch(requestUrlMulDay)
                            .then(function (response){
                                console.log('weather response', response)
                                return response.json()
                            }) 
                            .then (function (data){
                                console.log('mul day weather data', data)
                                var mulDayForecast = data
                                createForecast(mulDayForecast) //sends data for next 5 days forecast
                            })
        // clears out search fields 
        cityInput.value = ""
        stateInput.value = ""
    })}

    // takes data from API and appends forecast to page for today
    function createTodayForecast(todayForecast) {
        console.log('running createtodayforecast')
        
        var todayCard = document.createElement('card')
        var dayDateEl = document.createElement('h3')
        var weatherIcon = document.createElement('img')
        var dayTemp = document.createElement('p')
        var dayHumidity = document.createElement('p')
        var dayWind = document.createElement('p')

        console.log('single day icon code', todayForecast.weather[0].icon)
        var iconCode = todayForecast.weather[0].icon

        var unconvertDate = todayForecast.dt
        var dayDate = convertTimestamptoDate(unconvertDate)
        
        todayCard.setAttribute('class', 'card  col-6 col-md-3 col-lg-2 border-dark m-1')
        dayDateEl.setAttribute('class', 'card-title text-nowrap')
        dayTemp.setAttribute('class', 'card-text')
        dayHumidity.setAttribute('class', 'card-text')
        dayWind.setAttribute('class', 'card-text')
        weatherIcon.src = `http://openweathermap.org/img/w/${iconCode}.png`
        weatherIcon.setAttribute('class', 'card-img-top')

        dayDateEl.textContent = `${dayDate}`
        dayTemp.textContent = `Temp: ${todayForecast.main.temp}`
        dayHumidity.textContent = `Humidity: ${todayForecast.main.humidity}%`
        dayWind.textContent = `Wind Speed: ${todayForecast.wind.speed}`

        todayCard.append(weatherIcon, dayDateEl, dayTemp, dayHumidity, dayWind)
        displayedData.append(todayCard)
    }

    // takes data from API and appends forecast to page for next 5 days
    function createForecast(mulDayForecast) {
        console.log('running createForecast with this data:', mulDayForecast)
        for (var i = 0; i < mulDayForecast.list.length; i++) {
            var unconvertDate = mulDayForecast.list[i].dt
            var dayDate = convertTimestamptoDate(unconvertDate)
            var dayTime = convertTimestamptoTime(unconvertDate)
            
            // because API gives data in 3 hours sections, 10am is used to get only one data point per day
            if (dayTime === '10:00 AM') {
                var dayCard = document.createElement('card')
                var dayDateEl = document.createElement('h3')
                var weatherIcon = document.createElement('img')
                var dayTemp = document.createElement('p')
                var dayHumidity = document.createElement('p')
                var dayWind = document.createElement('p')

                console.log('mul day icon code', mulDayForecast.list[i].weather[0].icon)
                var iconCode = mulDayForecast.list[i].weather[0].icon

                dayCard.setAttribute('class', 'card  col-6 col-md-3 col-lg-2 border-dark m-1')
                dayDateEl.setAttribute('class', 'card-title text-nowrap')
                dayTemp.setAttribute('class', 'card-text')
                dayHumidity.setAttribute('class', 'card-text')
                dayWind.setAttribute('class', 'card-text')
                weatherIcon.src = `http://openweathermap.org/img/w/${iconCode}.png`
                weatherIcon.setAttribute('class', 'card-img-top')

                dayDateEl.textContent = `${dayDate}`
                dayTemp.textContent = `Temp: ${mulDayForecast.list[i].main.temp_max}`
                dayHumidity.textContent = `Humidity: ${mulDayForecast.list[i].main.humidity}%`
                dayWind.textContent = `Wind Speed: ${mulDayForecast.list[i].wind.speed}`

                dayCard.append(weatherIcon, dayDateEl, dayTemp, dayHumidity, dayWind)
                displayedData.append(dayCard) 
            }     
        }
    }

    // used to convert date data to human readible format
    function convertTimestamptoDate(timestamp) {
        var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.

        convertedDate = mm + '-' + dd  + '-' + yyyy
        return convertedDate;
    }

    // used to convert time data to human readible format
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

    //saves search terms in local storage
    function saveSearch(cityName, stateName) {
        console.log('saving search terms')
        var savedSearchTerms = cityName + ', ' + stateName
        localStorage.setItem("savedSearchTerms", savedSearchTerms)
        var savedSearchItems = document.getElementById('savedSearchList')
        var savedItem = document.createElement('p')
        var savedItemButton = document.createElement('button')
        savedItem.textContent = savedSearchTerms
        savedItemButton.append(savedItem)
        savedSearchItems.append(savedItemButton)
    }

    //runs on button click
    fetchButton.addEventListener('click', getData)
})
