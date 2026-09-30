import { StoryController } from './experience/story-controller.js';
document.documentElement.classList.add('js-ready');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const controller = new StoryController();
const abort = new AbortController();
const signal = abort.signal;
const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
function closeMenu(returnFocus = false) {
  menu?.setAttribute('aria-expanded','false'); links?.classList.remove('is-open');
  if (returnFocus) menu?.focus();
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(open)); links.classList.toggle('is-open',open);
}, {signal});
links?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); }, {signal});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true); }, {signal});
document.addEventListener('click', event => { if (!event.target.closest('.navbar')) closeMenu(); }, {signal});
window.addEventListener('resize', () => { if (innerWidth > 640) closeMenu(); }, {signal});
let revealObserver;
function setupReveals() {
  revealObserver?.disconnect();
  document.documentElement.classList.remove('motion-ready');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion-ready');
  // Observe the unclipped parent: a completely clipped target has zero intersection area.
  const targets = new Map();
  document.querySelectorAll('.reveal').forEach(element => {
    const target = element.parentElement;
    if (!targets.has(target)) targets.set(target, []);
    targets.get(target).push(element);
  });
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        targets.get(entry.target)?.forEach(element => element.classList.add('visible'));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0, rootMargin:'0px 0px -30px 0px'});
  targets.forEach((elements, target) => revealObserver.observe(target));
}
// Typography-only recomposition of the existing result claims.
document.querySelectorAll('.stat-box .result-value').forEach(element => {
  const text = element.textContent.trim();
  const match = text.match(/^(28|5×|100%)\s+(.+)$/);
  if (match) { element.textContent = ''; const value = document.createElement('strong'); value.textContent = match[1]; element.append(value, document.createTextNode(match[2])); }
});
// Preserve the email destination, with a reliably encoded message and native validation.
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const body = [...fields.entries()].map(([key,value]) => `${key}: ${value}`).join('\n\n');
  location.href = `mailto:marketing@avmedia.space?subject=${encodeURIComponent('Patient flow system — ' + fields.get('clinic'))}&body=${encodeURIComponent(body)}`;
}, {signal});
let experience, generation = 0;
async function enhance() {
  const version = ++generation;
  experience?.destroy(); experience = null;
  document.documentElement.classList.toggle('reduced-motion', motion.matches);
  setupReveals();
  if (motion.matches || !document.querySelector('[data-scene]')) return;
  try {
    const { createExperience } = await import('./experience/scene.js');
    if (version === generation && !motion.matches) experience = createExperience(controller);
  } catch { /* Static environment and all content remain available. */ }
}
motion.addEventListener('change', enhance, {signal});
const idle = window.requestIdleCallback || (callback => setTimeout(callback, 100));
idle(enhance);
window.addEventListener('pagehide', event => {
  // Keep listeners for the browser's back/forward cache; release GPU resources in both cases.
  ++generation; experience?.destroy(); experience = null;
  if (!event.persisted) { controller.destroy(); revealObserver?.disconnect(); abort.abort(); }
}, {signal});
window.addEventListener('pageshow', event => { if (event.persisted) { controller.requestUpdate(); enhance(); } }, {signal});
