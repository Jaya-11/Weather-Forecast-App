const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  resultsEl.innerHTML = '';
  setStatus('Looking up location...');

  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`).then(r=>r.json());
    if (!geo || !geo.results || geo.results.length === 0) {
      setStatus('Location not found.');
      return;
    }
    const loc = geo.results[0];
    setStatus(`Fetching forecast for ${loc.name}, ${loc.country}...`);

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7`;
    const data = await fetch(forecastUrl).then(r=>r.json());
    renderForecast(loc, data);
    setStatus('');
  } catch (err) {
    console.error(err);
    setStatus('Error fetching data.');
  }
});

function setStatus(txt){
  statusEl.textContent = txt;
}

function renderForecast(loc, data){
  if (!data || !data.daily) {
    setStatus('No forecast available.');
    return;
  }
  const {time, temperature_2m_max, temperature_2m_min, weathercode} = data.daily;
  const title = document.createElement('div');
  title.innerHTML = `<strong>Forecast for ${loc.name}, ${loc.country}</strong>`;
  resultsEl.appendChild(title);

  for (let i=0;i<time.length;i++){
    const d = document.createElement('div');
    d.className = 'day';
    d.innerHTML = `<div class="date">${time[i]}</div><div class="temps">High: ${temperature_2m_max[i]}°C • Low: ${temperature_2m_min[i]}°C • ${weatherCodeToText(weathercode[i])}</div>`;
    resultsEl.appendChild(d);
  }
}

function weatherCodeToText(code){
  // simplified mapping from Open-Meteo weather codes
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snowfall',
    73: 'Moderate snowfall',
    75: 'Heavy snowfall',
    80: 'Rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers'
  };
  return map[code] || 'Weather';
}
