# MECHMASTER ACADEMY

## Shared YouTube video management

The app stores YouTube metadata in Firebase Realtime Database so every visitor sees the same published videos. It never uploads or stores the actual video file, and it does not require a YouTube API key.

### Firebase setup

1. Create a project at [firebase.google.com](https://firebase.google.com).
2. Add a Web app in Firebase Project settings and copy its configuration values into `.env` using `.env.example`.
3. Create a **Realtime Database** and apply the rules from `database.rules.json`.
4. Enable **Authentication > Sign-in method > Email/Password**.
5. Open **Authentication > Users** and create the admin user email/password.
6. Deploy the app with all `VITE_FIREBASE_*` environment variables.

The Firebase environment variables are required for publishing shared videos. Without them, videos cannot be saved to the public library; browser-only storage must not be used for production publishing.

Firebase web API keys are intended to be included in browser applications. Database rules protect the data: visitors can read published videos, while only authenticated admin users can add, edit, or delete videos. Do not put Firebase Admin SDK credentials in this React app.

### Add videos

1. Open `/login` and sign in with the Firebase Authentication admin user.
2. Open `/admin/videos`.
3. Paste one YouTube URL or several URLs in the bulk box.
4. Click **Save One Video** or **Add Bulk Videos**.

New published videos are immediately available to every visitor at `/videos`, because they are read from the shared Firebase database.

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
