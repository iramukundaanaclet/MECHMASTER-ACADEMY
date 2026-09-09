# MECHMASTER ACADEMY

## Publish YouTube videos

This project stores YouTube metadata only. It does not upload or store video files, use a database, or require a YouTube API key.

The public video library is loaded from `public/videos.json`, which is deployed with the website. Browser `localStorage` is used only for temporary admin work on the current computer, so it is not treated as shared storage.

To publish videos for every visitor:

1. Open `/login`, then open `/admin/videos`.
2. Add one or more YouTube URLs and click **Add Bulk Videos**.
3. Click **Download videos.json**.
4. Replace the project's `public/videos.json` with the downloaded file.
5. Commit and deploy the updated project.

After deployment, every visitor receives the same `public/videos.json` file through `/videos`. Without a database or server-side storage, a browser cannot automatically write changes into the deployed website; the export and deploy step is therefore required.

## Local development

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
```

---

The original Vite template notes follow.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
