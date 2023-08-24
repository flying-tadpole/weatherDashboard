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
                var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=48b446f840f21fe274c2224a206ddfc4`
                    fetch(requestUrl)
                        .then(function (response){
                            console.log('weather response', response)
                            return response.json()
                        }) 
                        .then (function (data){
                            console.log('weather data', data)
                        })
})}

fetchButton.addEventListener('click', getData)