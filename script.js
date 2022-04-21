// WEATHER_API

weather_key = 'cf6afa64d71b437a8d0161320221604'
weather_url = 'http://api.weatherapi.com/v1/'

const weather_box = document.querySelector('#weather')
const languange = navigator.language.slice(0, 2)
fetch(weather_url+'current.json?key='+weather_key+'&q=Catania&aqi=no&lang='+languange).then(onSuccessWeather, onError).then(onJsonWeather)


function onSuccessWeather(response){
    return response.json()
}

function onError(error){
    console.log('Errore: ' + error)
}

function onJsonWeather(json){
    console.log(json)
    const image = weather_box.querySelector('#weather_image')
    const city_location = weather_box.querySelector('#city')
    const weather_info = weather_box.querySelector('#weather_condition')
    const region = weather_box.querySelector('#region')
    city_location.textContent = json.location.name
    region.textContent = json.location.region
    weather_info.textContent = json.current.condition.text + ', ' + json.current.temp_c + '°C'
    image.src = 'http:'+json.current.condition.icon
}


// SPOTIFY API

const spotify_key = '3408020a64b24389920a2f20cd117dc7'
const spotify_secret = 'a6037c41798b45e8b03ef56697467258'
const spotify_token_endpoint = 'https://accounts.spotify.com/api/token'
const spotify_endpoint = 'https://api.spotify.com/v1/playlists/2e3dcRuo9uDH6qD3NOGKAL?si=97b259b00b1744e4?limit=8'

let token
let audio = new Audio()
let playlist = []

fetch(spotify_token_endpoint, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
        "Content-Type": 'application/x-www-form-urlencoded',
        "Authorization" : 'Basic ' + btoa(spotify_key+':'+spotify_secret)
    }
}).then(r => r.json(), onError).then(onJsonToken)

function onJsonToken(json){
    token = json.access_token

    fetch(spotify_endpoint, {
        headers: {
            'Authorization' : "Bearer " + token
        }
    }).then(r => r.json()).then(addTracks)
}


function addTracks(json){
    const spotify_container = document.querySelector('#spotify_container')

    const tracks = json.tracks.items
    let maxNumber = json.tracks.total 
    if(json.tracks.total > 8) maxNumber = 8

    for(let i = 0; i < maxNumber; i++){
        console.log(tracks[i].track)

        const element = document.createElement('div')
        element.classList.add('spotify_element')

        const img = document.createElement('img')
        img.classList.add('spotify_image')
        img.src = tracks[i].track.album.images[1].url
        

        const info_container = document.createElement('div')
        info_container.classList.add('spotify_info')

        const title = document.createElement('a')
        title.textContent = tracks[i].track.name
        title.link = tracks[i].track.preview_url
        playlist.push(tracks[i].track.preview_url)
        title.addEventListener('click', play)

        const author = document.createElement('p')
        author.textContent = tracks[i].track.artists[0].name
        
        info_container.appendChild(title)
        info_container.appendChild(author)

        element.appendChild(img)
        element.appendChild(info_container)
        spotify_container.appendChild(element)
    }
}

function play(event){
    let link = event.currentTarget.link

    audio.src = link
    audio.play()
}

spotify_icon = document.querySelector('#spotify_icon')
spotify_icon.addEventListener('click', playRandom)

function playRandom(){
    let index = Math.floor(Math.random() * playlist.length)
    console.log(index)
    let link = playlist[index]
    audio.src = link
    audio.play()
}







