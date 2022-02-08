var apiKey = "3c1af0981b3683839898c3c198395aa7";
var cityInput = document.querySelector("#cityInput")
var currentCityContainerEl = document.querySelector("#currentCityWeather")
var weatherIconEl = document.getElementById("wicon")
var tempListItem = document.getElementById("Ftemp")
var windSpeedListItem = document.getElementById("wind-speed")
var humidityListItem = document.getElementById("humidity")
var UVIListItem = document.getElementById("uvi")
var citySearch = []
var searchesContainer = document.getElementById("savedSearch")
let theCurrentDate = document.querySelector(".current-date")
let dailyDate = document.querySelectorAll(".date")
let theDailyWeatherEl = document.querySelectorAll(".dicon")
let theDailyTempEl = document.querySelectorAll(".dailyTemp")
let theDailyWindspeedEl= document.querySelectorAll(".dailyWindSpeed")
let theDailyHumidityEl= document.querySelectorAll(".dailyHumidity")

var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    if (cityName) {
        getCity(cityName);
        cityInput.value = '';
    } else {
        alert('Please enter a city name');
    }
    // links the city names to an empty array; .push method adds new items to the array
    citySearch.push(cityName)
    // saves searched city to local storage
    localStorage.setItem("city", citySearch)
};



var getCity = function (cityName) {

    var geoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey

    fetch(geoURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    theName = data.name
                    let theLat = data[0].lat
                    let theLon = data[0].lon
                    currentCityContainerEl.textContent = data[0].name + ", " + data[0].state
                    getWeather(theLat, theLon)
                });
            } else {
                alert('Error:' + response.statusText);
            }

        });
};

var searchButton = document.querySelector(".btn")

searchButton.addEventListener("click", formSubmitHandler);

// WEATHER API
var getWeather = function (theLat, theLon) {

    var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?" + "lat=" + theLat + "&lon=" + theLon + "&exclude=minutely,hourly,alerts&appid=" + apiKey

    fetch(weatherURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);

                    // Data for the Current/Searched City Panel
                    let theDate = new Date(data.current.dt*1000)
                        
                    let shortDate = theDate.toLocaleString('en-US', {
                        weekday: 'short',
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'})
                    theCurrentDate.innerHTML = shortDate

                    let theWeatherIconCode = data.current.weather[0].icon
                    var iconurl = "http://openweathermap.org/img/w/" + theWeatherIconCode + ".png"
                    weatherIconEl.src = iconurl

                    let theTemp = data.current.temp
                    temperatureConverter(theTemp)
                    tempListItem.innerHTML = "<span>Temp: </span>" + tempConverted + " <span>&#8457</span>"

                    let theWindspeed = data.current.wind_speed
                    windSpeedListItem.innerHTML = "Wind: " + theWindspeed + " MPH"

                    let theHumidity = data.current.humidity
                    humidityListItem.innerHTML = "Humidity: " + theHumidity + " %"

                    let theUV = data.current.uvi
                    UVIListItem.innerHTML = "UV Index: " + theUV
                    // I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

                    // the Five Day forecast
                    for (let i = 0; i < 5; i++) {
            
                        let theDate = new Date(data.daily[i+1].dt*1000)
                        
                        let shortDate = theDate.toLocaleString('en-US', {
                            weekday: 'short',
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric'})
                        dailyDate[i].innerHTML = shortDate

                        let theDailyWeatherIconCode = data.daily[i].weather[0].icon
                        console.log(theDailyWeatherIconCode)

                        var dailyIconurl = "http://openweathermap.org/img/w/" + theDailyWeatherIconCode + ".png"
                        theDailyWeatherEl[i].src = dailyIconurl
                    
                        let theDailyTemp = data.daily[i].temp.max
                        temperatureConverter(theDailyTemp)
                        theDailyTempEl[i].innerHTML = "<span>Temp: </span>" + tempConverted + " <span>&#8457</span>"

                        let theDailyWindspeed = data.daily[i].wind_speed
                        theDailyWindspeedEl[i].innerHTML = "Wind: " + theDailyWindspeed + " MPH"

                        let theDailyHumidity = data.daily[i].humidity
                        theDailyHumidityEl[i].innerHTML = "Humidity: " + theDailyHumidity + " %"

                    }
                });
            } else {
                alert('Error:' + response.statusText);
            }

        });
};

/* When the input field receives input, convert the value from fahrenheit to celsius */
function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    tempConverted = Math.floor(((valNum - 273.15) * 1.8) + 32);
}

// use localstorage.getItem to display the recently searched cities
var searches = localStorage.getItem("city")
searchesContainer.innerHTML = searches

// create dynamic button
// when click button call the function that pushes the city value through the fetch 
//update the display with the new city
//update search function to save history and be ready to seach a new city