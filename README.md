# AVmedia — Cinematic sanctuary

Static HTML/CSS/JavaScript site deployed from the repository root on GitHub Pages. Domain, original copy, analytics and contact destinations are preserved.

## Run

- `node tools/serve.mjs` — local preview on port 4173.
- `node tools/check.mjs` — 161 original copy blocks, local links/assets, metadata, analytics, contact contracts and JavaScript syntax.

## Design and implementation

The revised direction draws on Kage's immersive environment, oversized typography and asymmetric image composition. All imagery is original; no Kage assets were copied. Dark stone, amber light and reflective water connect the page's chapters. DM Sans supplies display and body typography. About and Contact share the same visual language.

`css/style.css` supplies shared layout and accessibility foundations. `css/cinematic.css` supplies the cinematic direction and responsive compositions. The legacy Sass command writes to ignored `css/legacy.css`.

`js/experience/story-controller.js` is the single scroll/pointer model. `scene.js` uses one Three.js perspective camera, a depth-projected architectural image mesh, animated water refraction and foreground light particles. It is an image-based environment, not a fully modeled building. The camera moves gently with scroll and pointer input. Native scrolling and anchor navigation are preserved.

Three.js 0.180.0 is vendored with its MIT license. No additional framework or runtime dependency is required. Desktop DPR is capped at 1.5, mobile at 1.1; animation caps are 40/24 FPS. Mobile has fewer geometry segments and particles. Rendering pauses in hidden tabs; navigation disposes GPU resources. Reduced motion skips WebGL; unavailable/lost WebGL reveals the static responsive picture. Context restoration restarts rendering. All content and navigation remain usable without JavaScript.

## Assets

Built-in image generation produced `img/sanctuary.webp`, its smaller mobile version, and `img/beauty-editorial.webp`. The images were compressed with Pillow. The portrait is editorial mood imagery, not a client, testimonial or treatment outcome. Existing claims and testimonials remain supplied content, not independently verified.

Sanctuary prompt: original cinematic luxury aesthetics sanctuary at blue hour, black reflecting pool, huge circular aperture in a warm travertine monolith, suspended amber glass serum droplet, broad curved stone steps, fluted columns, amber grazing lights, cool ceiling light, mist, photoreal architectural CGI; wide 16:9, dark upper-left negative space for copy, portal at 60% width; no typography, people, Japanese imagery, medical tools, neon or purple.

Portrait prompt: original luxury skincare editorial photograph, close portrait of an adult woman in her thirties, warm medium skin, closed eyes, graceful three-quarter profile, authentic pores, amber side light with blue-black shadows, cinematic premium skincare photography; no text, logos, medical tools, plastic skin or treatment claims.

The former sculpture SVG and shaders remain as unused historical assets. The existing favicon and social preview are retained.

## Verification

The checker preserves 161 original copy blocks and verifies all local destinations. Responsive DOM checks cover 1920x1080, 1440x900, 1366x768, 1024x768, 768x1024, 430x932 and 390x844. Local preview fixtures exercise `/__verify__/reduced`, `/__verify__/no-webgl`, `/__verify__/no-js` and `/__verify__/context-loss`. These checks are not a real-device performance benchmark.

The contact form retains its original mailto destination, `marketing@avmedia.space`, with native validation and encoded message content. It requires the visitor's email app; no booking backend has been invented.
