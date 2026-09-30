import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=process.cwd();
const text=s=>s.replace(/<script\b[^]*?<\/script>/g,'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim().toLowerCase();
const source=JSON.parse(fs.readFileSync('tools/content-source.json','utf8'));
let preserved=0,links=0;
for(const [file,copy] of Object.entries(source)){
 const html=fs.readFileSync(file,'utf8'),visible=text(html);
 for(const item of copy){assert(visible.includes(item.toLowerCase()),`${file}: missing existing copy: ${item}`);preserved++;}
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${file}: one H1`);
 assert(html.includes('rel="canonical"'),`${file}: canonical`);
 assert(html.includes('id="main"'),`${file}: skip destination`);
 for(const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)){
  const target=match[1];if(/^(https?:|mailto:)/.test(target))continue;
  const [relative,hash]=target.split('#');const dest=relative||file;
  assert(fs.existsSync(path.resolve(root,dest)),`${file}: missing ${dest}`);
  if(hash){const destination=fs.readFileSync(dest,'utf8');assert(destination.includes(`id="${hash}"`),`${file}: missing #${hash}`);}links++;
 }
}
const landing=fs.readFileSync('index.html','utf8');
assert(landing.includes('G-T0M01M1FXW'),'Existing analytics');
assert.equal(fs.readFileSync('CNAME','utf8').trim(),'avclinicflow.com');
assert.equal([...landing.matchAll(/class="testimonial-card/g)].length,8,'Eight unique testimonials retained');
assert(fs.readFileSync('contactUs.html','utf8').includes('action="mailto:marketing@avmedia.space"'),'Contact destination');
for(const file of ['js/main.js','js/experience/story-controller.js','js/experience/scene.js','js/experience/shaders.js','tools/serve.mjs'])execFileSync(process.execPath,['--check',file]);
console.log(`PASS: ${preserved} existing copy blocks, ${links} local links/assets, metadata, analytics, domain, contact, testimonials, and JS syntax.`);
