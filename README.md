# Dots

A minimal static site for Dots — a Chicago coffee bar with two locations.

## Structure

The site is plain HTML/CSS with no build step. Each location is a folder with its
own `index.html`, and a shared `styles.css` at the root.

```
/                 Landing page — logo + location picker (choose a location)
/addison/         Roscoe Village — 2000 Addison St (the flagship coffee bar)
/fulton/          West Loop — inside Estereo FM, 1001 W Fulton Market (opening 2026)
/styles.css       Shared styles for every page
/assets/          Logo, favicon, flower, gallery + slide photography
```

Adding a third location later = copy `fulton/index.html` to a new folder, update its
copy, and add a `.location-card` to the landing page's `.locations` nav.

**West Loop placeholders:** `fulton/index.html` has `<!-- TODO -->` markers for the
final street address, hours, menu, and a Toast gift-card link — fill these in once the
lease is signed and the menu is set. The gallery is intentionally omitted there until
West Loop photography is shot.

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

Because pages reference each other with root-absolute paths (`/addison/`, `/fulton/`),
preview through a local server rather than opening files directly:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.
