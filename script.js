const apiKey = "3a3a618fbf8d4e22b9054911252707";

window.onload = () => {
  setAutoTheme(); // ⬅️ auto theme based on current time

  const savedCity = localStorage.getItem("city");
  if (savedCity) {
    document.getElementById("cityInput").value = savedCity;
    fetchWeather(savedCity);
  } else {
    getLocationWeather();
  }
};

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  html.setAttribute("data-theme", currentTheme === "light" ? "dark" : "light");
}

function setAutoTheme() {
  const currentHour = new Date().getHours();
  const html = document.documentElement;
  if (currentHour >= 7 && currentHour < 19) {
    html.setAttribute("data-theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
  }
}

async function fetchWeather(cityName) {
  const city = cityName || document.getElementById("cityInput").value || "London";
  localStorage.setItem("city", city);

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("weatherCard").classList.add("hidden");

  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("location").textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById("icon").src = data.current.condition.icon;
    document.getElementById("condition").textContent = data.current.condition.text;
    document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
    document.getElementById("wind").textContent = `💨 Wind: ${data.current.wind_kph} kph`;
    document.getElementById("humidity").textContent = `💧 Humidity: ${data.current.humidity}%`;
    document.getElementById("aqi").textContent = `🌫 AQI PM2.5: ${data.current.air_quality.pm2_5?.toFixed(2)}`;
    document.getElementById("lastUpdated").textContent = `🕒 Updated: ${data.current.last_updated}`;
    
    document.getElementById("weatherCard").classList.remove("hidden");
  } catch (error) {
    alert("City not found or API error.");
    console.error(error);
  } finally {
    document.getElementById("loading").classList.add("hidden");
  }
}

function getLocationWeather() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeather(`${lat},${lon}`);
      },
      () => {
        fetchWeather("London"); // fallback
      }
    );
  } else {
    fetchWeather("London");
  }
}
