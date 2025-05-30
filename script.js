const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const data = document.getElementById("data");
const body = document.body;
const img = document.querySelector("img");
const celBtn = document.getElementById("celci");
const farBtn = document.getElementById("faren");
let tempType = "f";
let currentWeatherData = null;

const API_KEY = "WN35YQJQT7PBM9BPP2TQMFB24";

let searchTerm = "seattle";

function setBgColor(feelsLike) {
    const feelsLikeF = tempType === "c" ? celsiusToFahrenheit(feelsLike) : feelsLike;

    if (feelsLikeF >= 90) {
        body.style.backgroundColor = "#ff5722";
        //add icons?
    }
    else if (feelsLikeF >= 75) {
        body.style.backgroundColor = "#ffcc80";
    }
    else if (feelsLikeF >= 65) {
        body.style.backgroundColor ="#a5d6a7";
    }
    else if (feelsLikeF >= 50) {
        body.style.backgroundColor = "#81d4fa";
    }
    else if (feelsLikeF >= 32) {
        body.style.backgroundColor = "#b3e5fc";
    }
    else {
        body.style.backgroundColor = "#e1f5fe";
    }
}

function setImage(condition) {
    const firstCondition = condition.split(",")[0].trim();

    if (firstCondition == "Rain") {
        img.src = "./cloud-drizzle.svg";
    }
    else if (firstCondition == "Clear") {
        img.src = "./sun.svg";
    }
    else if (firstCondition == "Partially cloudy") {
        img.src = "./partial.png";
    }
    else if (firstCondition == "Snow") {
        img.src = "./cloud-snow.svg"
    }
    else if (firstCondition == "Overcast") {
        img.src = "./cloud.svg";
    }
}

function fahrenheitToCelsius(temp) {
    return Math.round((temp - 32) * 5 / 9);
    console.log("in faren to cel");
}

function celsiusToFahrenheit(temp) {
    console.log("In cel to faren");
    return Math.round((temp * 9 / 5) + 32);
}

function updateWeatherDisplay () {
    if (!currentWeatherData) return;

    data.innerHTML = "";

    let feelsLike = currentWeatherData.currentConditions.feelslike;
    const tempSymbol = tempType === "f" ? "°F" : "°C";

    if (tempType === "c") {
        feelsLike = fahrenheitToCelsius(feelsLike);
    }

    setBgColor(feelsLike);

    const details = [
        { label: "Location: ", value: `${currentWeatherData.address.charAt(0).toUpperCase() + currentWeatherData.address.slice(1)}` },
        { label: "Feels Like: ", value: `${feelsLike}${tempSymbol}` },
        { label: "Conditions: ", value: `${currentWeatherData.currentConditions.conditions}` },
        { label: "Time: ", value: `${currentWeatherData.currentConditions.datetime}` },
        { label: "Humidity: ", value: `${currentWeatherData.currentConditions.humidity}` }
    ];

            
    details.forEach(detail => {
        const detailItem = document.createElement("div");

        const detailLabel = document.createElement("span");
        detailLabel.textContent = detail.label;

        const detailValue = document.createElement("span");
        detailValue.textContent = detail.value;

        detailItem.appendChild(detailLabel);
        detailItem.appendChild(detailValue);
        data.appendChild(detailItem);
    });
}


function fetchWeather(searchQuery) {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?key=${API_KEY}`, {mode: "cors"})
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            currentWeatherData = response;
            setImage(response.currentConditions.conditions);
            updateWeatherDisplay();
        })
        .catch(function(error) {
            console.error("Error: ", error);
            data.textContent = "Error fetching data. Please try again.";
        });
}

fetchWeather(searchTerm);

searchBtn.addEventListener("click", function() {
    body.style.backgroundColor = "";
    img.src = "";
    data.textContent = "";
    searchTerm = searchInput.value.trim() || "seattle";
    fetchWeather(searchTerm);
});

celBtn.addEventListener("click", () => {
    if (tempType === "f") {
        console.log("changing to c");
        tempType = "c";
        updateWeatherDisplay();
    }
    else {
        console.log("already cel");
    }
});

farBtn.addEventListener("click", () => {
    if (tempType === "c") {
        console.log("changing to f");
        tempType = "f";
        updateWeatherDisplay();
    }
    else {
        console.log("already faren");
    }
});