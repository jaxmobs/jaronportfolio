# Jaron Mobley — Portfolio

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → Add New Project → import the repo
3. Vercel auto-detects Vite. Hit Deploy.

## Connect your GoDaddy domain

1. In Vercel: Settings → Domains → Add `jaronmobley.com`
2. Vercel gives you an A record and a CNAME
3. In GoDaddy DNS settings, add both records
4. Wait up to a few hours for propagation

## Adding YouTube videos to projects

Open `src/data.js` and add a `youtubeId` to any project:

```js
{
  id: 1,
  title: "Nunatak Apex",
  ...
  youtubeId: "dQw4w9WgXcQ",  // ← the part after ?v= in the YouTube URL
}
```

That's it — the play button and modal appear automatically.

## Customising content

- **Projects**: edit `src/data.js`
- **Your bio text**: edit the `AboutSection` in `src/App.jsx`
- **Contact email / Instagram**: update the constants at the top of `ContactSection` in `src/App.jsx`
- **Colors**: the gold accent is `#C4A35A`, background is `#0A0E12` — do a project-wide find/replace to retheme
