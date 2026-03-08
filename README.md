# Katie & Me — Travel Map

A personal travel map showing all our adventures together.

## How to run locally

1. Make sure Node.js is installed (https://nodejs.org)
2. Open a terminal (Command Prompt as Administrator on Windows) in this folder
3. Run:
   ```
   npm install
   npm start
   ```
4. Opens at http://localhost:3000

## How to deploy (Vercel)

1. Upload this folder to a GitHub repository (exclude node_modules)
2. Go to https://vercel.com and sign in with GitHub
3. Click "Add New Project" → select your repository → click "Deploy"
4. Your site will be live in ~60 seconds

## How to add your own photos

In `src/App.js`, find any trip by its `id` and replace the placeholder URLs
in the `photos` array with links to your own images.

For example, to use a photo hosted on Google Drive or Dropbox,
get the direct image link and paste it in place of the placeholder URL.

## How to add a new destination

In `src/App.js`, add a new entry to the `TRIPS` array following this format:

```js
{
  id: "unique-id",
  name: "City Name",
  emoji: "🌍",
  dates: "Month Year",
  butters: true,        // true if Butters came, false if not
  coords: [lng, lat],   // longitude first, then latitude
  color: "#hexcolor",
  photos: [
    "https://your-photo-url-1.jpg",
    "https://your-photo-url-2.jpg",
  ]
}
```
