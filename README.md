# Simple Weather Forecast App

Small static app that fetches a 7-day forecast using Open-Meteo (no API key required).

Usage
- Open `index.html` in your browser.
- Enter a city name and click "Get Forecast".

Notes
- Uses the Open-Meteo geocoding API and forecast API.
- If opening `index.html` directly causes CORS/fetch issues in your browser, serve the folder with a simple static server, e.g.:

```bash
# Python 3
python -m http.server 8000

# then open http://localhost:8000 in your browser
```
