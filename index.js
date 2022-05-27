const watchlistButton = document.getElementById("watchlist-button")
const homeButton = document.getElementById("home-button")
const searchButton = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const summary = document.getElementById("summary")
const watchlistSummary = document.getElementById("watchlist-summary")
let summaryHTML = ""
let watchlistArr = []

function add(title) {
    fetch(`https://www.omdbapi.com/?t=${title}&apikey=cf0fdf8`)
        .then(res => res.json())
        .then(data => {
            window.localStorage.setItem(data.Title, JSON.stringify(data))
            watchlistArr.push(data.Title)
        })
}

function remove(title) {
    window.localStorage.removeItem(title)
    window.location.reload()
}

if (searchButton) {
    summary.innerHTML = `
        <img src="./images/FilmReel.png" class="film-reel" />
        <p class="start-exploring">Start exploring</p>
    `
    searchButton.addEventListener("click", function(e) {
        e.preventDefault()
        fetch(`https://www.omdbapi.com/?s=${searchInput.value}&type=movie&apikey=cf0fdf8`)
            .then(res => res.json())
            .then(data => {
                if (data.Response === "False") {
                    summary.innerHTML = `
                        <p class="no-results">Unable to find what you're looking for. Please try another search.</p>
                    `
                    return
                }
                let summaryHTML = ""
                let searchList = data.Search.map(movie => movie.Title)
                for (let i = 0; i < searchList.length; i++) {
                    fetch(`https://www.omdbapi.com/?t=${searchList[i]}&apikey=cf0fdf8`)
                        .then(res => res.json())
                        .then(data => {
                            summaryHTML += `
                                    <div id="recommendations" class="recommendations">
                                        <img src="${data.Poster}" class="poster" />
                                        <div class="movie-info-container">
                                            <div class="first-row">
                                                <h2 class="title">${data.Title}</h2>
                                                <img src="./images/Star.png" class="star" />
                                                <p class="rating">${data.imdbRating}</p>
                                            </div>
                                            <div class="second-row">
                                                <p class="time">${data.Runtime}</p>
                                                <p class="genre">${data.Genre}</p>
                                                <img src="./images/Add.png" class="add-btn" onclick="add('${data.Title}')" />
                                                <p class="watchlist-btn">Watchlist<p>
                                            </div>
                                            <p class="description">${data.Plot}</p>
                                        </div>
                                    </div>
                                `
                                summary.innerHTML = summaryHTML
                            })
                }
            })
    })
}

if (homeButton) {
    let watchlistPicks = []
    let keys = Object.keys(localStorage)
    let i = keys.length
    
    while (i--) {
        watchlistPicks.push(JSON.parse(localStorage.getItem(keys[i])))
    }
    
    if (watchlistPicks.length === 0) {
        watchlistSummary.innerHTML = `
            <p class="watchlist-empty">Your watchlist is looking a little empty...</p>
            <div class="add-movies">
                <a class="index-link" href="./index.html"><img src="./images/Add.png" class="add-btn" /></a>
                <p class="watchlist-btn">Let's add some movies!<p>
            </div>
        `
    } else {
        for (let i = 0; i < watchlistPicks.length; i++) {
            let movie = watchlistPicks[i]
            summaryHTML += `
                <div id="recommendations" class="recommendations">
                    <img src="${movie.Poster}" class="poster" />
                    <div class="movie-info-container">
                        <div class="first-row">
                            <h2 class="title">${movie.Title}</h2>
                            <img src="./images/Star.png" class="star" />
                            <p class="rating">${movie.imdbRating}</p>
                        </div>
                        <div class="second-row">
                            <p class="time">${movie.Runtime}</p>
                            <p class="genre">${movie.Genre}</p>
                            <img src="./images/Remove.png" class="add-btn" onclick="remove('${movie.Title}')" />
                            <p class="watchlist-btn">Remove<p>
                        </div>
                        <p class="description">${movie.Plot}</p>
                    </div>
                </div>
            `
        }
        watchlistSummary.innerHTML = summaryHTML
    }
}