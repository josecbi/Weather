const currentPosition = {
    lat: '',
    lon: ''
}

const promise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => {
        resolve(position)   
    }, error => {
        reject(error)      
    }) 
})
 
promise
    .then(position => {
        currentPosition.lat = position.coords.latitude
        currentPosition.lon = position.coords.longitude

        fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${currentPosition.lat}&lon=${currentPosition.lon}&units=metric&lang=es`)
            .then(res => res.json())
            .then(data => {
                const city = data.name
                const temp = Math.round(data.main.temp);
                const iconWeather = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
                const ampm = data.weather[0].icon[data.weather[0].icon.length - 1]
                const descriptionTemp = data.weather[0].description
                const feeling = Math.round(data.main.feels_like)   
                const humidity = data.main.humidity
                const windSpeed = data.wind.speed
                const color = setBackground(data.weather[0].main, ampm)
                const iconTemp = setIconTemp(feeling) 
                
                document.getElementsByTagName('body')[0].style.background = color  
                document.getElementById('city').textContent = city      
                document.getElementById('current-temp').innerHTML = `${temp}<span>º</span>`
                document.getElementById('current-description').innerHTML = `
                    ${descriptionTemp} <img src=${iconWeather}>
                `
                document.getElementById('first-description').innerHTML = `<img class="icon" src="${iconTemp}"> Sensación`
                document.getElementById('feels-like').innerHTML = `${feeling}º`
                document.getElementById('humidity').textContent = `${humidity}%`
                document.getElementById('wind-speed').textContent = `${windSpeed} m/s`
                
            })
   })
   .catch(error => alert(`Conect your location. ${error}`))

//"https://apis.scrimba.com/openweathermap/data/2.5/weather?q=holguin&units=metric&lang=es"


function setBackground (status, ampm) {
    let color = 'linear-gradient(#4786FA, #AAC7FE)'
    if(status === 'Thunderstorm' || status === 'Drizzle' || status === 'Rain' || status === 'Clouds' && ampm === 'd'){
        color = 'linear-gradient(#B3CBE5, #D9E5F2)'
    } 
    else if(status === 'Thunderstorm' || status === 'Drizzle' || status === 'Rain' || status === 'Clouds' && ampm === 'n') {
        color = 'linear-gradient(#2B3A5D, #657FBC)'
    }
    else if(status === 'Clear' && ampm === 'n') {
        color = 'linear-gradient(#0432AC, #4C7DFD)'
    }
    else {
        color = 'linear-gradient(#4786FA, #AAC7FE)'
    }
    return color
}

function setIconTemp(temp) {
    return temp < 15 
        ? 'icons/thermometer-snow.svg'
        : temp > 25
        ? 'icons/thermometer-sun.svg'
        : 'icons/thermometer-low.svg'
}