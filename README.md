# maxieharrington.me

Static site. No framework, no build step. Editing a file and pushing to `main` is deploying.

## Structure
- `index.html` — home (hero + selected work)
- `work.html` — filterable project index (role chips)
- `work/starbound.html` — project page template (video, making-of, facts, credits, stills). Duplicate for each project.
- `photography.html` — film photography wall
- `about.html` — bio + contact (merged) · `operations.html` — Building Story case study
- `css/style.css` — all styling (colors/type at the top in `:root`)
- `js/main.js` — scroll reveals, filters, footer clock
- `img/` — put all images here (hero.jpg, project covers, stills, photography)

## Adding images
Drop files in `img/`, then swap the placeholder `<div class="ph">` blocks for
`<img class="ph" src="img/yourfile.jpg" alt="">`, and set the hero in `css/style.css`
(`.hero .bg` → `background-image: url('../img/hero.jpg')`).

Export images at ~2000px wide, JPG quality ~80. Keep each under ~500KB so the site stays fast.

## Deploy (one-time setup)
1. Create a GitHub repo (public), e.g. `maxieharrington.me`.
2. Push this folder to it (GitHub Desktop, or drag-and-drop on github.com works fine).
3. Repo → Settings → Pages → Source: `main` branch, `/ (root)`. Save.
4. Custom domain: enter `maxieharrington.me` (this repo already has the `CNAME` file).
5. At your domain registrar, add DNS records:
   - `A` records for `maxieharrington.me` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` record for `www` → `<your-github-username>.github.io`
6. Back in GitHub Pages settings, check “Enforce HTTPS” once DNS propagates (minutes to a few hours).

After that: edit → commit → push. Live in under a minute.
