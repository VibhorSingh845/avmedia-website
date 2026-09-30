import * as THREE from '../vendor/three.module.min.js';

// One depth-projected environment. The static picture remains underneath the canvas.
export function createExperience(controller) {
  const host = document.querySelector('.world');
  if (!host) return { destroy() {} };
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!context) return { destroy() {} };
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: false });
  canvas.setAttribute('aria-hidden', 'true');
  const mobile = innerWidth <= 640;
  const abort = new AbortController();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 80);
  camera.position.set(0, 0, 22);
  const uniforms = { uMap: { value: null }, uTime: { value: 0 } };
  const geometry = new THREE.PlaneGeometry(38, 21.375, mobile ? 24 : 48, mobile ? 16 : 32);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setZ(i, Math.max(0, -y - 2) * .12);
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform sampler2D uMap; uniform float uTime; varying vec2 vUv;
    void main(){vec2 uv=vUv;float water=1.-smoothstep(.15,.37,uv.y);
    uv.x+=sin(uv.y*155.+uTime*.7)*.00075*water;
    uv.y+=sin(uv.x*85.+uTime*.45)*.00035*water;
    vec3 color=texture2D(uMap,uv).rgb;
    float light=sin(uv.x*80.+uv.y*100.+uTime*.55)*.008*water;
    gl_FragColor=vec4(color+light,1.);}`
  });
  scene.add(new THREE.Mesh(geometry, material));
  const dustGeometry = new THREE.BufferGeometry();
  const dust = new Float32Array((mobile ? 22 : 55) * 3);
  for (let i=0;i<dust.length;i+=3){dust[i]=(Math.random()-.5)*30;dust[i+1]=(Math.random()-.5)*16;dust[i+2]=2+Math.random()*7;}
  dustGeometry.setAttribute('position',new THREE.BufferAttribute(dust,3));
  const dustMaterial = new THREE.PointsMaterial({color:0xe1bc87,size:.018,transparent:true,opacity:.35,depthWrite:false});
  const motes = new THREE.Points(dustGeometry,dustMaterial); scene.add(motes);
  let state=controller.state, frame=0, last=0, ready=false, destroyed=false, lost=false;
  const unsubscribe=controller.subscribe(next=>{state=next;});
  function resize(){renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.1:1.5));renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
  function tick(now){
    if(destroyed || document.hidden || lost) return;
    frame=requestAnimationFrame(tick);
    if(now-last < (mobile?1000/24:1000/40)) return;
    last=now;
    const progress=state.progress;
    const portrait=camera.aspect<1;
    const baseZ=Math.max(22,26/camera.aspect);
    const targetZ=(portrait?22:baseZ)-Math.sin(progress*Math.PI)*1.4;
    const targetX=(portrait?3.6:0)+Math.sin(progress*Math.PI*2)*.6+state.pointer.x*.12;
    camera.position.x+=(targetX-camera.position.x)*.035;
    camera.position.y+=(-state.pointer.y*.07+Math.sin(progress*Math.PI)*.25-camera.position.y)*.035;
    camera.position.z+=(targetZ-camera.position.z)*.035;
    uniforms.uTime.value=now*.001;motes.rotation.z=Math.sin(now*.00004)*.025;
    renderer.render(scene,camera);
    if(ready) host.classList.add('webgl-ready');
  }
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);host.classList.remove('webgl-ready');},{signal:abort.signal});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;frame=requestAnimationFrame(tick);},{signal:abort.signal});
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden&&!lost)frame=requestAnimationFrame(tick);},{signal:abort.signal});
  window.addEventListener('resize',resize,{passive:true,signal:abort.signal});
  host.append(canvas);resize();
  const texture=new THREE.TextureLoader().load(mobile?'img/sanctuary-mobile.webp':'img/sanctuary.webp',()=>{if(!destroyed){ready=true;frame=requestAnimationFrame(tick);}},undefined,()=>host.classList.remove('webgl-ready'));
  uniforms.uMap.value=texture;
  return { destroy(){destroyed=true;abort.abort();unsubscribe();cancelAnimationFrame(frame);host.classList.remove('webgl-ready');geometry.dispose();material.dispose();dustGeometry.dispose();dustMaterial.dispose();texture.dispose();renderer.dispose();canvas.remove();} };
}
