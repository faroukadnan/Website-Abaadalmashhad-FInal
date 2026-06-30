# Abaad AlMashhad Smart News Website

This project is a local prototype for the Arabic live-news platform.

## Run

```powershell
node server.js
```

Then open:

```text
http://localhost:3000
```

## What It Does

- Serves the Arabic RTL website.
- Polls configured RSS/web news sources every 2 minutes.
- Detects new items and avoids duplicates.
- Sends new items to Gemini using the editorial prompt in `editorialPrompt.js`.
- Converts the Gemini output into article cards and reading pages.
- Keeps the Gemini key on the backend through `.env`, not in browser code.

## Files

- `index.html` is the website shell.
- `styles.css` mirrors the reference design using Cairo, navy header, red ticker, tabs, and white cards.
- `app.js` renders the frontend and loads processed articles from `/api/articles`.
- `server.js` polls sources, calls Gemini, and serves the API.
- `editorialPrompt.js` contains the full Arabic editorial agent prompt.
- `feeds.json` contains the RSS/web sources extracted from the Excel sheet.
- `.env.example` shows the required environment variables.

## API

- `GET /api/articles?limit=20&offset=0`
- `GET /api/status`
- `GET /api/refresh`

## Notes

The X account links from the spreadsheet are not polled directly because X requires either an official API or an RSS bridge. Add those accounts through an RSS bridge or X API integration before enabling them as automated sources.
