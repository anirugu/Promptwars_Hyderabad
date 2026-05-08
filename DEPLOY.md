# 🚀 Deploying WanderForge to Google Cloud (no Docker required)

WanderForge is a pure client-side React/Vite SPA — `npm run build` produces a
static `dist/` folder. That means you do **not** need Docker, a `Dockerfile`,
or any server code to host it on GCP. This guide gives you three official,
Docker-free paths, ranked from easiest to most flexible:

| # | Service                     | Best for                              | Free tier         | Setup time |
|---|-----------------------------|---------------------------------------|-------------------|------------|
| 1 | **Firebase Hosting**        | Personal / hobby / production SPA     | ✅ 10 GB / 360 MB / day | ~5 min |
| 2 | **App Engine Standard**     | Want pure GCP, no Firebase project    | ✅ 28 instance-hours / day | ~10 min |
| 3 | **Cloud Storage + (CDN)**   | Cheapest, custom domain w/ HTTPS      | 5 GB Always-Free  | ~15 min |

> 💡 If in doubt, pick **Option 1 (Firebase Hosting)**. It is a Google product
> running on GCP infrastructure, free for hobby projects, supports SPA
> rewrites natively, gives you a free `*.web.app` HTTPS URL, and deploys with
> a single command.

---

## ✅ Prerequisites (all options)

1. A Google account.
2. A GCP project with billing enabled (most free tiers still require billing).
   - Console: <https://console.cloud.google.com> → *New Project*
3. **Node 18+** locally (you already have this).
4. A clean production build:
   ```powershell
   npm install
   npm run build
   ```
   This populates `./dist/`.

---

## 🟢 Option 1 — Firebase Hosting (recommended)

### Why this option
- Zero build/server config. Just point at `dist/`.
- SPA rewrites + immutable asset caching are already configured in
  [`firebase.json`](./firebase.json).
- Free `*.web.app` HTTPS URL out of the box; custom domains supported.
- Deploys in seconds.

### One-time setup

1. **Install the Firebase CLI** (or skip and use `npx firebase-tools`):
   ```powershell
   npm install -g firebase-tools
   ```

2. **Log in:**
   ```powershell
   firebase login
   ```

3. **Create a Firebase project** (or attach to an existing GCP project)
   at <https://console.firebase.google.com> → *Add project*.
   Note its *Project ID* (e.g. `wanderforge-42`).

4. **Point this repo at your project** — open
   [`.firebaserc`](./.firebaserc) and replace the placeholder:
   ```json
   {
     "projects": {
       "default": "YOUR-FIREBASE-PROJECT-ID"
     }
   }
   ```

   Or, equivalently:
   ```powershell
   firebase use --add
   ```

### Deploy

```powershell
npm run deploy:firebase
```

That's it. The CLI prints a URL like:

```
✔  Deploy complete!
Hosting URL: https://YOUR-PROJECT.web.app
```

### Updating the site
Just re-run `npm run deploy:firebase`. Each deploy is versioned — you can
roll back from the Firebase console under **Hosting → Release history**.

### Custom domain
Firebase console → **Hosting → Add custom domain** → follow the DNS TXT/A
record instructions. SSL is provisioned automatically.

---

## 🟡 Option 2 — Google App Engine Standard (pure GCP, no Docker)

### Why this option
- Pure first-party GCP service.
- No Docker, no `Dockerfile`, no server code — uses static handlers only.
- Routes, caching, HTTPS, custom domains all handled by GCP.
- The included [`app.yaml`](./app.yaml) declares the SPA rewrite for you.

### One-time setup

1. **Install the gcloud CLI:**
   <https://cloud.google.com/sdk/docs/install>

2. **Log in and pick a project:**
   ```powershell
   gcloud auth login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```

3. **Initialise App Engine** (only required once per project — pick a region
   close to your users; cannot be changed later):
   ```powershell
   gcloud app create --region=us-central
   ```

### Deploy

```powershell
npm run deploy:gae
```

This runs `npm run build` (producing `dist/`) and then
`gcloud app deploy --quiet`. After ~1–2 min you'll get:

```
Deployed service [default] to [https://YOUR_GCP_PROJECT_ID.appspot.com]
```

You can also open it directly:

```powershell
gcloud app browse
```

### How it serves the SPA
[`app.yaml`](./app.yaml) defines three handlers:

1. `/assets/*`   → fingerprinted JS/CSS chunks → 365-day immutable cache.
2. Other static files (favicon, fonts, images) → 30-day cache.
3. Every other path → `dist/index.html` so `react-router-dom` handles
   client-side routes correctly even on direct navigation/refresh.

### Updating the site
Re-run `npm run deploy:gae`. Old versions are kept (free) and you can
traffic-split or roll back from
**App Engine → Versions** in the GCP console.

---

## 🔵 Option 3 — Cloud Storage static website (cheapest)

### Why this option
- Pennies/month for low-traffic sites.
- No App Engine app to manage.
- Best when paired with Cloud Load Balancer + Cloud CDN for HTTPS on a
  custom domain (the bare bucket only serves HTTP under
  `storage.googleapis.com`).

### One-time setup

1. Authenticate gcloud (see Option 2).
2. **Create a bucket** (must be globally unique):
   ```powershell
   $env:BUCKET = "wanderforge-yourname"
   gcloud storage buckets create gs://$env:BUCKET --location=us-central1 --uniform-bucket-level-access
   ```
3. **Make objects publicly readable:**
   ```powershell
   gcloud storage buckets add-iam-policy-binding gs://$env:BUCKET --member=allUsers --role=roles/storage.objectViewer
   ```
4. **Enable static-website mode** (use `index.html` for both root and
   404 — that's the SPA fallback trick):
   ```powershell
   gcloud storage buckets update gs://$env:BUCKET --web-main-page-suffix=index.html --web-error-page=index.html
   ```

### Deploy

```powershell
npm run build
npm run deploy:gcs --bucket=$env:BUCKET
```

(Or directly:
`gcloud storage cp -r dist/* gs://$env:BUCKET/ --cache-control="public, max-age=3600"`)

Your site is live at:

```
https://storage.googleapis.com/YOUR_BUCKET/index.html
```

### Custom domain + HTTPS
Plain GCS buckets only serve HTTPS at `storage.googleapis.com`. To put
your bucket behind your own domain over HTTPS, follow:
<https://cloud.google.com/storage/docs/hosting-static-website> — it walks
you through fronting the bucket with **Cloud Load Balancer + Cloud CDN +
managed SSL**.

---

## 🛠 Troubleshooting

### `firebase: command not found`
- Install globally: `npm install -g firebase-tools`, **or** just use
  `npm run deploy:firebase` (the script uses `npx firebase-tools`).

### Direct URL like `/explore` returns 404 in production
- This is a SPA-rewrite issue. Make sure:
  - **Firebase**: the `rewrites` block in `firebase.json` is intact.
  - **App Engine**: the catch-all handler in `app.yaml` points to
    `dist/index.html`.
  - **Cloud Storage**: `web-error-page` is set to `index.html`.

### `gcloud app deploy` complains about no `app.yaml`
- Run from the repo root (where `app.yaml` lives), not from `dist/`.

### Stale assets after deploy
- `index.html` is served with `Cache-Control: no-cache` (Firebase) so the
  browser always picks up the new build, while fingerprinted JS/CSS files
  use long-lived caches. If you ever see stale content, hard-refresh
  (Ctrl-F5) or check the Network tab to confirm new hashes are loaded.

### Costs
- All three paths sit comfortably in GCP's free tier for hobby use. Set up
  a billing budget alert at GCP Console → **Billing → Budgets & alerts**
  for peace of mind.

---

## 🔁 Continuous deployment (optional next step)

If you push this repo to GitHub, you can wire up automatic deploys:

- **Firebase Hosting**: `firebase init hosting:github` writes a GitHub
  Actions workflow that deploys on every push to `main` and creates
  preview URLs for PRs.
- **App Engine / Cloud Storage**: use Cloud Build triggers
  (`gcloud builds submit` from a `cloudbuild.yaml`) or a GitHub Actions
  workflow with `google-github-actions/auth` + `setup-gcloud`.

Either is a 10-minute add-on once you've successfully deployed manually.

---

Happy shipping! 🌍✈️
