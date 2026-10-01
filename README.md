# AVmedia — ThreeUI Kage integration

AVmedia's original marketing copy in the registered ThreeUI Kage landing page. The static document is used directly because the supplied React component is an iframe wrapper around that document; no React build is required.

## Source provenance

Canonical: https://threeui.com/landing-pages/kage.html
Bundle: https://threeui.com/source-code/kage-landing-page.json
Canonical SHA-256: `c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49`

`vendor/threeui/kage.original.html` preserves the verified original. The manifest and wrapper/control sources are archived beside it. All 14 scene images, the source Three.js runtime, and the embedded font stylesheet are local and verified against the supplied hashes.

`css/kage.css` and `js/kage.js` retain the authored temple geometry, shaders, water, camera journey, leaves, interactive cloth cards, foreground stages, and responsive layouts. `css/avmedia-kage.css` and `js/avmedia-kage.js` adapt the marketing content. The selected settings use Onest, heading weight 400, body weight 300, red #e0231c, heading 46px, body 17px, and -.012em heading spacing, with authored responsive scaling. About and Contact share these fonts, colors and source artwork.

Adaptations: AVMEDIA wordmark and sizing, existing copy/navigation, longer content grids, foreground below reading content, nested-anchor offsets, keyboard-accessible chapter links, reduced ambient motion, and WebGL context fallback. Original supplied claims and testimonials are retained, not independently verified. The contact form retains its mailto behavior and needs the visitor's email app.

## Local checks

- `node tools/serve.mjs` serves http://127.0.0.1:4173.
- `node tools/check.mjs` verifies original copy, links, metadata, contact destination and syntax.
- `node tools/check-kage.mjs` verifies canonical source and asset hashes.
- `?nogl=1` exercises the authored static WebGL fallback.

## Hosting

Target: https://avclinicflow.com on the Oracle VM, in a separate static Nginx container named `avmedia-clinicflow-site`. The GitHub repository is cloned at `/opt/avmedia-clinicflow/repo`; only public runtime files are exported to `/opt/avmedia-clinicflow/site`. The shared edge proxy gains domain-specific blocks and is gracefully reloaded, without restarting existing applications. Deployment files are in `deploy/`.

DNS: apex A to 80.225.225.165; www CNAME to avclinicflow.com. Existing Google Workspace MX, SPF, DKIM, DMARC and verification records must remain intact. TLS uses the shared Certbot webroot and certificate volume. Keep private keys and environment files out of this repository.
