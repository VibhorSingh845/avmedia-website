import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
// Local-only fixtures exercise the real page under environmental failure modes.
const fixtures={
 'context-loss': `const probe=setInterval(()=>{const canvas=document.querySelector('.webgl-ready canvas');if(!canvas)return;clearInterval(probe);const gl=canvas.getContext('webgl2'),ext=gl.getExtension('WEBGL_lose_context');if(!ext){document.documentElement.dataset.contextTest='unavailable';return;}ext.loseContext();setTimeout(()=>{document.documentElement.dataset.lossFallback=String(!document.querySelector('.webgl-ready'));ext.restoreContext();setTimeout(()=>{document.documentElement.dataset.contextTest='restored';},500);},350);},100);`,

 reduced:`const realMatchMedia=window.matchMedia.bind(window);window.matchMedia=query=>query==='(prefers-reduced-motion: reduce)'?{matches:true,media:query,addEventListener(){},removeEventListener(){}}:realMatchMedia(query);`,
 'no-webgl':`const realGetContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:realGetContext.call(this,type,...args);};`
};
http.createServer(async(req,res)=>{
 try{
  const url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(url.startsWith('/__verify__/')){
   const mode=url.split('/').pop();if(!['reduced','no-webgl','no-js','context-loss'].includes(mode)){res.writeHead(404).end();return;}
   let html=await readFile(path.join(root,'index.html'),'utf8');
   if(mode==='no-js')html=html.replace(/<script\b[^]*?<\/script>/g,'');
   html=html.replace('<head>',`<head><base href="/"><script>${fixtures[mode]||''}</script>`);
   res.writeHead(200,{'Content-Type':'text/html','Cache-Control':'no-store'}).end(html);return;
  }
  const file=path.resolve(root,'.'+(url==='/'?'/index.html':url));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
 }catch{res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('AVmedia preview: http://127.0.0.1:4173'));
