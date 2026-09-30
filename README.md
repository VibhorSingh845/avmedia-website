# AVmedia — Clinical Luxury

The existing HTML/CSS/JavaScript site and GitHub Pages root deployment are retained. No build step is required. CNAME remains `avclinicflow.com`.

## Run and verify

- `node tools/serve.mjs` serves the site at http://127.0.0.1:4173.
- `node tools/check.mjs` verifies original marketing copy, local destinations, analytics, metadata, the domain, contact behavior, and JavaScript syntax.
- `npm run dev` and `npm run check` wrap those commands when npm is available.
- `tools/content-source.json` records 161 unique source copy blocks from the original commit `195c5fd`. Duplicate marquee testimonials were consolidated into eight unique, stationary testimonials.

The stylesheet is hand-authored. The retained legacy Sass watcher writes to `css/legacy.css`, so it cannot overwrite the redesign.

## Art direction and structure

Warm ivory, stone, charcoal, and AVmedia red meet Italiana display typography and DM Sans body text, loaded through Google Fonts. The custom procedural contour sculpture suggests beauty, precision, and consistency without treatment imagery. The landing page moves through arrival, the lead-handling gap, the six-step system, tailored automation, existing results, clinic voices, AVmedia's positioning, and the final CTA. About and Contact share the same visual system.

## Experience architecture

`js/experience/story-controller.js` owns scroll progress, current process step, active section navigation, pointer coordinates, and the visible visual stage. It batches scroll and resize work in requestAnimationFrame. Native scrolling preserves anchor URLs and keyboard behavior; no scroll-jacking library is used.

`js/experience/scene.js` dynamically loads one Three.js renderer and reuses its canvas across the hero, sticky system scene, and automation scene. Three contoured forms and restrained red points progress from separated positions toward an organized structure. Scroll interpolates form positions, orientation, and camera distance. Pointer response is intentionally subtle.

`js/experience/shaders.js` provides original procedural reflection and Fresnel lighting. This is a lightweight glass-like material, not costly physical screen-space refraction. There are no model or texture downloads.

Three.js **0.180.0** is vendored locally in `js/vendor/`, with its MIT license. It is the only new runtime library; no animation framework or component library was added. The two minified files total about 720 KB raw / 181 KB gzip. Delivery compression depends on the static host.

## Performance, accessibility, and resilience

The HTML content and static SVG arrive before Three.js; initialization runs during idle time and dynamic import separates the WebGL payload. Desktop DPR is capped at 1.5, mobile at 1.15. Mobile starts with fewer geometry segments and six points instead of twelve. Frame rates are capped at 40 desktop / 24 mobile. Rendering stops when no visual stage is visible or the document is hidden. Resources, observers, and listeners are disposed on navigation; back/forward cache restoration reinitializes the renderer.

Reduced motion skips WebGL entirely, removes the text reveals, and preserves native anchor navigation. WebGL initialization failure or context loss reveals the original static SVG. Context restoration resumes rendering. With JavaScript disabled, all marketing content, anchors, CTAs, the native form, and mobile navigation remain accessible.

Mobile uses a dedicated hero composition, compact vertical process, alternate result layout, and expandable navigation. Skip links, focus indicators, semantic headings, form labels, autocomplete, and native form validation are included.

The original contact form uses **mailto**, not a server-backed booking service. It still opens the visitor's email app, now with an encoded subject and message. No email service, CRM, or booking endpoint was invented.

## Verification

Browser checks covered all three routes at 1920×1080, 1440×900, 1366×768, 1024×768, 768×1024, 430×932, and 390×844: no horizontal overflow or heading overflow. Hero, process, automation, results, About, and Contact were visually reviewed. Mobile menu open/close, section hashes, CTA routes, required fields, and invalid email handling were verified without sending a message.

Local-only fixtures in the preview server verify reduced motion, absent WebGL, no JavaScript, and actual WebGL context loss/restoration:

- `/__verify__/reduced`
- `/__verify__/no-webgl`
- `/__verify__/no-js`
- `/__verify__/context-loss`

The context-loss test confirmed that the static visual appeared while the context was lost, then one canvas resumed rendering. No console errors were reported during the tested flows. HTML nesting and JS syntax checks pass. These are local browser checks, not a Lighthouse score or a real-device/network benchmark.

## Assets and future changes

`img/sculpture.svg` is the original static counterpart to the procedural sculpture. `img/social-preview.svg` is an editable source for the PNG share image, and `img/favicon.svg` supplies the favicon. The existing stock marketing images remain in the repository but are not used by the redesign.

No photography placeholders need replacement. If real clinic photography is added later, use licensed imagery with consent where required; keep the current copy and conversion destinations. Existing results and testimonials were preserved as supplied, not independently substantiated or expanded.
