# ToonVerse

ToonVerse is a React/Vite cartoon browser with an Express API and a local video-container service.

## Run locally

1. Start MongoDB locally.
2. In `server`, configure the required environment variables in `.env` and run `npm install` followed by `npm run dev`.
3. In `client`, run `npm install` followed by `npm run dev`.
4. Put supported video files in `video_container/<cartoon-slug>/`.

The local API and media service runs at `http://localhost:5000`; the Vite app runs at `http://localhost:5173`.

## Deploy the frontend to Vercel

Set the Vercel project's root directory to `client`; `vercel.json` supplies the Vite build and output settings for that root. Set `VITE_API_BASE_URL` in the Vercel project to the public URL of a separately hosted API, ending in `/api`, if one is available. If it is unset, the production frontend uses same-origin `/api` requests.

The Express API and videos in `video_container` are not deployed to Vercel. Vercel's serverless runtime does not provide persistent local disk for uploaded media, and the repository intentionally excludes video files and server secrets. To make cloud playback and downloads work for public visitors, deploy the API to a persistent server, configure a production database, and store videos in durable object storage; then set `VITE_API_BASE_URL` to that API's URL.

## GitHub

Local environment files, dependencies, build output, and media files are excluded from Git using the root `.gitignore`.
