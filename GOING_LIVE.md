# Going Live — Move Now Group

The site is now wired to be production-ready. To go from placeholder to live, fill in the values below. Everything reads from a single config object — no need to hunt through 11 HTML files.

## Step 1 — Edit `js/main.js` (single file)

Open `js/main.js` and edit the `window.MNG_CONFIG` block at the top. Every field is empty or a clearly-fake placeholder. Replace with real values:

| Field | What to put in | Where to get it |
|---|---|---|
| `FORM_ENDPOINT` | Your Formspree or Web3Forms POST URL | Sign up at [formspree.io](https://formspree.io) (free, 50/mo) or [web3forms.com](https://web3forms.com) (free, unlimited). Create one form per account — the `_form` field in the payload tags each lead by service. |
| `GA4_ID` | `G-XXXXXXXXXX` Measurement ID | [analytics.google.com](https://analytics.google.com) → Admin → Data Streams → Web → copy Measurement ID |
| `GADS_CONVERSION_ID` | `AW-XXXXXXXXXX` | [ads.google.com](https://ads.google.com) → Goals → Conversions → New conversion action (Website) |
| `GADS_CONVERSION_LABELS.*` | One label per event (8 labels total) | Same screen as above — create 8 conversion actions: `jet_inquiry`, `passport_inquiry`, `immediate_move`, `crypto_inquiry`, `remittance_inquiry`, `consultation`, `whatsapp_click`, `phone_click`. Each gives you a label like `AbCdEfGhIj-Q`. |
| `CLARITY_ID` | 10-char project ID | [clarity.microsoft.com](https://clarity.microsoft.com) → Settings → Project ID. Free, gives you session replay. |
| `PHONE` | Display phone, e.g. `+1-555-123-4567` | Your real 24/7 number |
| `PHONE_DIGITS` | Same number, no separators (`+15551234567`) | For `tel:` links |
| `WA_DIGITS` | International digits only, no `+` or spaces (`15551234567`) | For `https://wa.me/` URLs |
| `EMAIL_URGENT` | Inbox where leads land | Set up Google Workspace on `movenowgroup.com` first |

## Step 2 — Replace placeholders in HTML

The HTML files still contain the canonical placeholder strings so phone/whatsapp/email show up visibly until you swap them. Run these find-and-replace pairs across the project (any editor will do — VS Code "Find in Files" works):

| Find | Replace with |
|---|---|
| `+1-888-000-0000` | your display phone, e.g. `+1-555-123-4567` |
| `+18880000000` | your phone with `+` and no separators |
| `wa.me/18880000000` | `wa.me/<your-digits>` |
| `urgent@movenowgroup.com` | your real urgent inbox |

After this, do a quick scan:

```bash
grep -rn "888-000-0000\|18880000000\|wa.me/188\|@movenowgroup" *.html services/*.html
```

Anything that turns up is a missed placeholder.

## Step 3 — Test before announcing

Open the site (locally or on staging) and:

1. **Submit each of the 6 forms** with test data → confirm:
   - Lead lands in your `EMAIL_URGENT` inbox within 60 seconds
   - The lead payload includes a `_form` field (`jet_inquiry`, etc.) so you can filter
   - The lead includes a `_utms` object with attribution data

2. **Click each `tel:` link on a mobile phone** → confirms ringing your real number.

3. **Click each WhatsApp link** → confirms opening a real chat with you.

4. **Open Google Ads → Goals → Conversions** → submit a form on the site → wait ~3 hours → confirm the conversion appears in the dashboard.

5. **Open GA4 Realtime** → submit a form → confirm the custom event appears with the right `_form` value.

6. **Send $1 USDT** to the wallet address listed on `services/crypto.html` → confirm receipt.

## Step 4 — Unblock deploys

Either:

- **Add credits / payment method to Netlify** → push triggers an auto-deploy
- **Migrate to Cloudflare Pages** → connect the GitHub repo, point DNS, free unlimited bandwidth

The repo has been pushed; no code work blocks the deploy.

## Step 5 — Then run the acquisition plan

See `/Users/gab/.claude/plans/eager-gliding-eagle.md` for the 90-day plan:

- **Phase 0** (Week 1) — what this document covers
- **Phase 1** (Weeks 1-4) — Trustpilot, Telegram, LinkedIn, directories
- **Phase 2** (Weeks 4-12) — Google Search Ads on 4 campaigns, ~$1,500/mo
- **Phase 3** (Weeks 2-12+) — 12 long-form SEO guides, 1/week
- **Phase 4** (Weeks 4-12+) — Partnerships with immigration lawyers, NGOs, CBI agencies
- **Phase 5** (Week 12+) — Optimize, scale what works

## Critical: forms still work without a backend

Even if you launch with `FORM_ENDPOINT` empty, the form handler falls back to opening the user's email client with the request pre-filled, addressed to `EMAIL_URGENT`. **No lead is lost** — but Google Ads can't see it as a conversion until you wire the endpoint.

Recommended: set up Formspree first (free, 5 minutes), then everything else.
