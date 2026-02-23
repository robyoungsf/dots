# Dots Cafe

A minimal single-page site for Dots — a new cafe in Roscoe Village, Chicago.

## Publish on GitHub Pages

1. **Create a new repository** on GitHub (e.g. `dots-cafe` or `username.github.io` for a user/org site).

2. **Push this project** to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Turn on GitHub Pages**
   - Repo → **Settings** → **Pages**
   - Under **Source**, choose **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)**
   - Save. The site will be at `https://YOUR_USERNAME.github.io/YOUR_REPO/` (or `https://YOUR_USERNAME.github.io/` if the repo is named `USERNAME.github.io`).

## Custom domain

1. **Add a CNAME file** (already in this repo as `CNAME`). Replace the contents with your domain only, e.g.:
   ```
   dots-cafe.com
   ```
   No `https://` or path — just the domain. Commit and push.

2. **In GitHub**: **Settings** → **Pages** → **Custom domain**, enter your domain and save. GitHub will show DNS instructions.

3. **At your DNS provider** (where you bought the domain), add:
   - **A records** for `@` and `www` (if you use www) pointing to:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or a **CNAME** for `www` to `YOUR_USERNAME.github.io` (and keep A records for the root).

4. Wait for DNS to propagate (up to 48 hours, often minutes). In **Pages** you can enable **Enforce HTTPS** once the domain is verified.

## Local preview

Open `index.html` in a browser, or run a simple server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.
