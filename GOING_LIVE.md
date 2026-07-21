# Move Now Group Deployment Notes

This repo deploys the static site root to Cloudflare Pages through `.github/workflows/deploy.yml`.

Current production design was restored from Cloudflare deployment `7509d05e` and uses:

- `index.html`
- `about.html`
- `contact.html`
- `privacy.html`
- `terms.html`
- `thanks.html`
- `styles.css`
- `services/*.html`

Important:

- Do not reintroduce the old `css/` or `js/` site shell.
- Keep new service pages linked from the Services menu, footer, and `sitemap.xml`.
- Cloudflare production updates on pushes to `main`, so verify locally before pushing.
