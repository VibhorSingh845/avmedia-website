import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(fs.readFileSync('vendor/threeui/manifest.json','utf8'));
const entries=[...manifest.files,...manifest.assets];
let count=0;
for(const entry of entries){
 let file=entry.path==='public/landing-pages/kage.html'?'vendor/threeui/kage.original.html':entry.path.replace(/^public\//,'');
 if(!file.startsWith('landing-pages/')&&!file.endsWith('kage.original.html'))continue;
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),entry.sha256,file);count++;
}
for(const file of ['js/kage.js','js/avmedia-kage.js'])execFileSync(process.execPath,['--check',file]);
console.log(`PASS: ${count} canonical source/runtime/font/image hashes; Kage JavaScript syntax.`);
