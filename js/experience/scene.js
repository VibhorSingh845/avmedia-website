import * as THREE from '../vendor/three.module.min.js';
import { vertexShader, fragmentShader } from './shaders.js';
const QUALITY = { mobileDpr: 1.15, desktopDpr: 1.5, mobileFps: 24, desktopFps: 40 };

export function createExperience(controller) {
  let renderer;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!context) return { destroy() {} };
    renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' });
  }
  catch { return { destroy() {} }; }
  const abort = new AbortController();
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 30);
  camera.position.z = 7.6;
  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const uniforms = { uTime: { value: 0 }, uPhase: { value: 0 }, uDark: { value: 0 } };
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, side: THREE.DoubleSide });
  const mobile = innerWidth <= 640;
  const geometry = new THREE.TorusGeometry(1.25, .23, mobile ? 16 : 24, mobile ? 80 : 140);
  const positions = geometry.attributes.position;
  // A subtly pinched, asymmetric contour gives this sculpture its own silhouette.
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const angle = Math.atan2(y, x);
    const scale = 1 + Math.sin(angle * 3 + .4) * .08;
    positions.setXYZ(i, x * scale, y * scale * 1.18, z + Math.sin(angle * 2) * .11);
  }
  geometry.computeVertexNormals();
  const forms = Array.from({length: 3}, (_, i) => {
    const form = new THREE.Mesh(geometry, material);
    form.rotation.set(i * .8, i * 1.05, i * .7);
    sculpture.add(form);
    return form;
  });
  const beadGeometry = new THREE.SphereGeometry(.055, 10, 8);
  const beadMaterial = new THREE.MeshBasicMaterial({ color: 0xac352b });
  const beads = Array.from({length: mobile ? 6 : 12}, (_, i) => {
    const bead = new THREE.Mesh(beadGeometry, beadMaterial);
    const a = i * 2.39996;
    bead.userData.start = new THREE.Vector3(Math.sin(a)*2, Math.cos(a)*2, Math.sin(a*2)*.6);
    bead.position.copy(bead.userData.start);
    sculpture.add(bead);
    return bead;
  });
  let host = null, frame = 0, last = 0, phase = 0, rotation = 0, disposed = false, lost = false;
  let state = controller.state;
  function resize() {
    if (!host || lost) return;
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth <= 640 ? QUALITY.mobileDpr : QUALITY.desktopDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.position.z = camera.aspect < .8 ? 9 : 7.6;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  const unsubscribe = controller.subscribe(next => {
    state = next;
    if (host !== state.stage) {
      host?.classList.remove('webgl-ready');
      observer.disconnect();
      host = state.stage;
      if (host && !lost) { host.append(canvas); observer.observe(host); resize(); }
    }
    wake();
  });
  function wake() {
    if (!frame && !disposed && !lost && host && !document.hidden) frame = requestAnimationFrame(render);
  }
  function render(now) {
    frame = 0;
    if (disposed || lost || document.hidden || !host) return;
    const interval = 1000 / (innerWidth <= 640 ? QUALITY.mobileFps : QUALITY.desktopFps);
    if (now - last >= interval) {
      const delta = Math.min((now - last) / 1000, .1); last = now;
      rotation += delta * .055;
      phase += (state.phase - phase) * .055;
      const dark = host.dataset.scene === 'system';
      uniforms.uTime.value += delta;
      uniforms.uPhase.value = phase;
      uniforms.uDark.value = dark ? 1 : 0;
      sculpture.rotation.set(.12 + state.pointer.y * .035, rotation + state.pointer.x * .065, -.15 + phase * .35);
      forms.forEach((form, i) => {
        form.rotation.x = i * .8 + phase * (i - 1) * .5;
        form.rotation.y = i * 1.05 + phase * .3;
        const separation = dark ? (1 - phase) * .30 : 0;
        form.position.x = (i - 1) * separation;
        form.scale.setScalar(1 - i * .055);
      });
      beads.forEach((bead, i) => {
        const a = i / beads.length * Math.PI * 2 + rotation;
        const end = new THREE.Vector3(Math.cos(a)*1.9, Math.sin(a)*1.9, 0);
        bead.position.copy(bead.userData.start).lerp(end, phase);
        bead.scale.setScalar(dark ? .75 : .45);
      });
      const baseDistance = camera.aspect < .8 ? 9 : 7.6;
      camera.position.z += (baseDistance - (dark ? phase * .45 : 0) - camera.position.z) * .04;
      renderer.render(scene, camera);
      host.classList.add('webgl-ready');
    }
    wake();
  }
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(frame); frame = 0; last = performance.now(); wake(); }, {signal:abort.signal});
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; host?.classList.remove('webgl-ready');
  }, {signal:abort.signal});
  canvas.addEventListener('webglcontextrestored', () => { lost = false; resize(); wake(); }, {signal:abort.signal});
  wake();
  return { destroy() {
    disposed = true; cancelAnimationFrame(frame); unsubscribe(); observer.disconnect(); abort.abort();
    host?.classList.remove('webgl-ready'); geometry.dispose(); material.dispose(); beadGeometry.dispose(); beadMaterial.dispose();
    renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
  } };
}
