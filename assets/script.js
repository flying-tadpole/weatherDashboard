var cityInput = document.getElementById('cityName')
var stateInput = document.getElementById('stateName')
var cityName = cityInput.value
var stateName = stateInput.value

var fetchButton = document.getElementById('fetch-data')
var displayedData = document.getElementById('fetchedData')
var resetButton = document.getElementById('resetPage')

function getData() {
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

                            var weatherForcast = document.createElement('div')
                            var dayOne = document.createElement('card')
                            var dayTwo = document.createElement('card')
                            var dayThree = document.createElement('card')
                            var dayFour = document.createElement('card')
                            var dayFive = document.createElement('card')
                            var day1Date = document.createElement('h3')
                            var day2Date = document.createElement('h3')
                            var day3Date = document.createElement('h3')
                            var day4Date = document.createElement('h3')
                            var day5Date = document.createElement('h3')
                            var day1MaxTemp = document.createElement('p')
                            var day2MaxTemp = document.createElement('p')
                            var day3MaxTemp = document.createElement('p')
                            var day4MaxTemp = document.createElement('p')
                            var day5MaxTemp = document.createElement('p')
                            var day1Humidity = document.createElement('p')
                            var day2Humidity = document.createElement('p')
                            var day3Humidity = document.createElement('p')
                            var day4Humidity = document.createElement('p')
                            var day5Humidity = document.createElement('p')
                            var day1Wind = document.createElement('p')
                            var day2Wind = document.createElement('p')
                            var day3Wind = document.createElement('p')
                            var day4Wind = document.createElement('p')
                            var day5Wind = document.createElement('p')

                            day1Date.textContent = weatherData.list[4].main.temp_max
                            day1MaxTemp.textContent = `High Of: ${weatherData.list[4].main.temp_max}`
                            day1Humidity.textContent = `Humidity: ${weatherData.list[4].main.humidity}`
                            day1Wind.textContent = `Wind Speed: ${weatherData.list[4].wind.speed}`

                            day2MaxTemp.textContent = `High Of: ${weatherData.list[12].main.temp_max}`
                            day2Humidity.textContent = `Humidity: ${weatherData.list[12].main.humidity}`
                            day2Wind.textContent = `Wind Speed: ${weatherData.list[12].wind.speed}`

                            day3MaxTemp.textContent = `High Of: ${weatherData.list[20].main.temp_max}`
                            day3Humidity.textContent = `Humidity: ${weatherData.list[20].main.humidity}`
                            day3Wind.textContent = `Wind Speed: ${weatherData.list[20].wind.speed}`

                            day4MaxTemp.textContent = `High Of: ${weatherData.list[28].main.temp_max}`
                            day4Humidity.textContent = `Humidity: ${weatherData.list[28].main.humidity}`
                            day4Wind.textContent = `Wind Speed: ${weatherData.list[28].wind.speed}`

                            day5MaxTemp.textContent = `High Of: ${weatherData.list[36].main.temp_max}`
                            day5Humidity.textContent = `Humidity: ${weatherData.list[36].main.humidity}`
                            day5Wind.textContent = `Wind Speed: ${weatherData.list[36].wind.speed}`

                            dayOne.append(day1MaxTemp, day1Humidity, day1Wind)
                            dayTwo.append(day2MaxTemp, day2Humidity, day2Wind)
                            dayThree.append(day3MaxTemp, day3Humidity, day3Wind)
                            dayFour.append(day4MaxTemp, day4Humidity, day4Wind)
                            dayFive.append(day5MaxTemp, day5Humidity, day5Wind)
                            weatherForcast.append(dayOne, dayTwo, dayThree, dayFour, dayFive)
                            displayedData.append(weatherForcast)
                            
                        })
})}


fetchButton.addEventListener('click', getData)