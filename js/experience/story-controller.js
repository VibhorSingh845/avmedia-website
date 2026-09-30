// One scroll model drives the DOM and the optional Three.js renderer.
export class StoryController {
  constructor() {
    this.listeners = new Set();
    this.frame = 0;
    this.abort = new AbortController();
    this.stages = [...document.querySelectorAll('[data-scene]')];
    this.steps = [...document.querySelectorAll('.process-card')];
    this.links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    this.progress = document.querySelector('.reading-progress');
    this.nav = document.querySelector('.navbar');
    this.state = { progress: 0, phase: 0, stage: null, pointer: { x: 0, y: 0 } };
    const options = { passive: true, signal: this.abort.signal };
    window.addEventListener('scroll', () => this.requestUpdate(), options);
    window.addEventListener('resize', () => this.requestUpdate(), options);
    window.addEventListener('pointermove', event => {
      if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      this.state.pointer.x = event.clientX / innerWidth * 2 - 1;
      this.state.pointer.y = event.clientY / innerHeight * 2 - 1;
    }, options);
    document.addEventListener('pointerleave', () => { this.state.pointer.x = this.state.pointer.y = 0; }, options);
    this.update();
  }
  requestUpdate() {
    if (!this.frame) this.frame = requestAnimationFrame(() => { this.frame = 0; this.update(); });
  }
  update() {
    const height = innerHeight;
    this.state.progress = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - height));
    this.progress?.style.setProperty('transform', `scaleX(${this.state.progress})`);
    this.nav?.classList.toggle('is-scrolled', scrollY > 20);
    let best = null, area = 0;
    for (const stage of this.stages) {
      const rect = stage.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, 0));
      if (visible > area) { best = stage; area = visible; }
    }
    this.state.stage = best;
    let current = 0, distance = Infinity;
    this.steps.forEach((step, i) => {
      const rect = step.getBoundingClientRect();
      const delta = Math.abs(rect.top + rect.height / 2 - height * .5);
      if (delta < distance) { distance = delta; current = i; }
    });
    this.steps.forEach((step, i) => step.classList.toggle('is-current', i === current));
    const number = document.querySelector('.active-step');
    if (number) number.textContent = String(current + 1).padStart(2, '0');
    this.state.phase = best?.dataset.scene === 'system' ? current / Math.max(1, this.steps.length - 1) : best?.dataset.scene === 'automation' ? 1 : 0;
    let active = null;
    this.links.forEach(link => {
      const target = document.querySelector(link.hash);
      if (target && target.getBoundingClientRect().top < height * .45) active = link;
    });
    this.links.forEach(link => {
      link.classList.toggle('is-active', link === active);
      if (link === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    this.listeners.forEach(callback => callback(this.state));
  }
  subscribe(callback) { this.listeners.add(callback); callback(this.state); return () => this.listeners.delete(callback); }
  destroy() { this.abort.abort(); cancelAnimationFrame(this.frame); this.listeners.clear(); }
}
