# MECHMASTER ACADEMY

## Shared YouTube video management

The app stores YouTube metadata in Supabase so every visitor sees the same published videos. It never uploads or stores the actual video file, and it does not require a YouTube API key.

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
3. Open **Authentication > Users** and create the admin user email/password.
4. Copy the project URL and public anon key into a local `.env` file using `.env.example`.
5. Deploy the app with the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables.

The anon key is designed to be used in a browser. Never put a Supabase service-role key in this React app. Row-level security allows visitors to read published videos, while only authenticated admin users can add, edit, or delete videos.

### Add videos

1. Open `/login` and sign in with the Supabase admin user.
2. Open `/admin/videos`.
3. Paste one YouTube URL or several URLs in the bulk box.
4. Click **Save One Video** or **Add Bulk Videos**.

New published videos are immediately available to every visitor at `/videos`, because they are read from the shared Supabase database.

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
