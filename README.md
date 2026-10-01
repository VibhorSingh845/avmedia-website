# AVmedia — the daylight clinic courtyard

A cinematic agency website for med spa owners. Original AVmedia copy, analytics and contact destinations are preserved. The scene uses original Three.js clinic geometry while retaining the Kage camera journey, reflective water, interactive cloth cards, falling foliage, reveals and foreground motion.

## Visual direction

A contemporary two-storey clinic replaces the temple and the first clinic concept. Curved cantilevered roofs, glass balconies, timber soffits, fluted stone, planted terraces, a pergola, treatment daybeds, an entry canopy and reception details give the building human scale. A shallow arrival staircase, water gardens, benches, olive foliage and bronze sculpture complete the courtyard.

Clear blue daylight, distant green hills and gently moving cloud layers replace the night scene. Ivory page surfaces, deep green typography, sage details and bronze accents run through the homepage, cards, forms, About, Contact and footer. Ambient animation freezes with reduced-motion preferences while scrolling remains functional.

`js/kage.js` owns the scene and motion. `css/avmedia-kage.css` adapts layout and palette. `css/kage-interior.css` styles About and Contact, and `css/daylight.css` applies the shared light palette throughout. `img/clinic/` contains compressed scene renders. The source architecture is intentionally stylized, not a photograph of a real client clinic.

## Provenance

The original Kage document and manifest remain in `vendor/threeui/`. Canonical SHA-256: `c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49`.
Source: https://threeui.com/landing-pages/kage.html
Bundle: https://threeui.com/source-code/kage-landing-page.json

The supplied React component wraps the canonical HTML in an iframe; this static project uses the document directly. The current visual scene is an AVmedia adaptation, not an exact visual copy of Kage. Legacy scene builders are retained but unused; the original source archive remains unchanged.

## Run and verify

- `node tools/serve.mjs` — localhost preview on port 4173.
- `node tools/check.mjs` — original copy, local links, metadata, contact and JavaScript syntax.
- `node tools/check-kage.mjs` — original-source and vendored asset hashes.
- `?nogl=1` — static fallback.
- `?shot=0&artwork=1&adapt=0` — render the courtyard without UI for artwork. Other shot indices use the authored camera waypoints.

The contact form uses `mailto:marketing@avmedia.space` and opens the visitor's email application. Existing claims and testimonials remain supplied content, not independently verified.

## VM deployment

Production: https://avclinicflow.com (www redirects to the apex).
Repository: `/opt/avmedia-clinicflow/repo`.
Public files: `/opt/avmedia-clinicflow/site`.
Container: `avmedia-clinicflow-site`, Nginx, separate from the existing projects.

After pulling the reviewed commit on the VM, export only public files:

```sh
git archive HEAD index.html aboutUs.html contactUs.html css js img landing-pages robots.txt sitemap.xml | tar -x -C /opt/avmedia-clinicflow/site
```

The shared edge proxy has a dedicated `BEGIN AVCLINICFLOW` block. Back up its configuration, change only that block, run `nginx -t`, then gracefully reload the proxy. Do not restart the other applications. Proxy templates are in `deploy/`.

HTTPS covers apex and www with a Let's Encrypt certificate. HTTP redirects to HTTPS; HSTS and upgrade-insecure-requests enforce secure requests. Existing cron jobs renew certificates through the shared Certbot webroot. DNS apex A points to 80.225.225.165 and www CNAME points to avclinicflow.com. Preserve Google Workspace email and verification records.
