/* Soft 2D paper-and-plush friends, drawn locally without image assets or WebGL. */
function createLittleStage(canvas, actorElement, bubbleElement) {
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const coats=['#fff3d5','#ddd0ef','#f8e3a2','#cbdcc2'],outline='#807366',ink='#514b46';
 const sadFeelings=new Set(['sad','worried','anxious','hurt','overwhelmed','embarrassed','nervous']);
 const happyFeelings=new Set(['hopeful','happy','calm','caring']);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let reduced=motion.matches;
 motion.addEventListener?.('change',e=>reduced=e.matches);
 let actors=[],speaker=null,width=600,height=385,last=0,active=false;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const observer=new ResizeObserver(()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*d);canvas.height=Math.round(height*d);ctx.setTransform(d,0,0,d,0,0);});observer.observe(canvas);
 function ellipse(x,y,rx,ry,fill,stroke=false){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=outline;ctx.lineWidth=2.1;ctx.stroke();}}
 function line(points,color=ink,size=2){ctx.beginPath();ctx.moveTo(...points[0]);for(const p of points.slice(1))ctx.lineTo(...p);ctx.strokeStyle=color;ctx.lineWidth=size;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
 function curve(start,control,end,color=ink,size=1.8){ctx.beginPath();ctx.moveTo(...start);ctx.quadraticCurveTo(...control,...end);ctx.strokeStyle=color;ctx.lineWidth=size;ctx.lineCap='round';ctx.stroke();}
 function body(color){ctx.beginPath();ctx.moveTo(-43,21);ctx.bezierCurveTo(-47,-12,-40,-49,-18,-55);ctx.bezierCurveTo(-7,-59,9,-58,21,-54);ctx.bezierCurveTo(43,-46,48,-10,44,22);ctx.bezierCurveTo(43,39,25,42,0,42);ctx.bezierCurveTo(-24,42,-42,39,-43,21);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=outline;ctx.lineWidth=2.2;ctx.stroke();}
 function draw(a,t,scale){
  const kind=Math.abs(Number(a.character.color)||0)%4,human=a.character.human,walking=a.speed>.008&&!reduced,sad=sadFeelings.has(a.feeling),happy=happyFeelings.has(a.feeling);
  const gait=Math.sin(a.phase),breathe=reduced?0:Math.sin(t*1.8+a.seed)*.65;
  const bob=walking?-Math.abs(gait)*2:0;
  ctx.save();ctx.translate(a.x*width,a.y*height);
  ellipse(0,42*scale,43*scale,6*scale,'#f0edf0');
  ctx.scale(scale,scale);ctx.translate(0,bob+breathe);ctx.rotate(walking?gait*.035:(reduced?0:Math.sin(t*.7+a.seed)*.012));
  const color=coats[kind];
  // Little feet and ears are outlined separately for a simple sticker-like silhouette.
  ellipse(human?-13:-19,40+(walking?Math.max(0,gait)*-3:0),human?9:11,6,human?'#a69ab4':kind===0?'#e9ba73':color,true);
  ellipse(human?13:20,40+(walking?Math.max(0,-gait)*-3:0),human?9:11,6,human?'#a69ab4':kind===0?'#e9ba73':color,true);
  if(!human&&kind===1){ellipse(-27,-51,13,14,color,true);ellipse(27,-51,13,14,color,true);ellipse(-27,-52,6,7,'#efdae5');ellipse(27,-52,6,7,'#efdae5');}
  if(!human&&kind===3){
   curve([0,-53],[0,-66],[2,-70],'#849b72',2.4);ellipse(-7,-66,9,4,'#b7ce9b',true);ellipse(9,-70,9,5,'#b7ce9b',true);
  }
  if(!human)body(color);
  if(human){
   // Upright silhouette: separate legs, level shoulders, a visible neck, and a lifted head.
   line([[-13,18],[-13,35]],'#a69ab4',12);line([[13,18],[13,35]],'#a69ab4',12);
   ctx.beginPath();ctx.moveTo(-25,20);ctx.lineTo(-25,-32);ctx.quadraticCurveTo(-25,-46,-12,-47);ctx.lineTo(12,-47);ctx.quadraticCurveTo(25,-46,25,-32);ctx.lineTo(25,20);ctx.quadraticCurveTo(0,25,-25,20);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=outline;ctx.lineWidth=2.2;ctx.stroke();
   ellipse(0,-49,9,12,'#f6dcc4',true);
   for(const side of [-1,1]){curve([side*24,-35],[side*32,-17],[side*31,-1],outline,3);ellipse(side*31,1,5,6,'#f6dcc4',true);}
   curve([-9,-40],[0,-32],[9,-40],'#ab98bc',2);
   ctx.save();ctx.translate(0,-57);
   ellipse(0,-24,30,29,'#f6dcc4',true);ctx.beginPath();ctx.moveTo(-29,-27);ctx.bezierCurveTo(-32,-66,32,-66,29,-27);ctx.quadraticCurveTo(22,-39,12,-44);ctx.quadraticCurveTo(-6,-30,-29,-27);ctx.fillStyle='#8a7165';ctx.fill();ctx.strokeStyle=outline;ctx.stroke();
   ctx.restore();
  }else if(kind===0){curve([-5,-55],[-14,-67],[-11,-58],outline,2);curve([-5,-55],[-2,-66],[1,-56],outline,2);}
  else if(kind===2){ellipse(0,14,25,21,'#fff0c9');}
  else if(kind===3){ellipse(0,16,24,20,'#e4ecd9');}
  // Tiny tucked-in paws, with a modest wave toward the person speaking.
  const toward=a.partnerSide||1,reach=a.speaking&&!reduced?Math.sin(t*2.5)*2:0;
  if(!human)for(const side of [-1,1])curve([side*39,7],[side*(30+(side===toward?reach:0)),4],[side*30,18],outline,2);
  const fy=human?-80:-16,faceShift=a.look*(human?1:2);
  const blink=!reduced&&Math.abs(t-a.blinkAt)<.075;
  if(t>a.blinkAt+.12)a.blinkAt=t+2.8+Math.random()*4;
  for(const side of [-1,1]){
   const x=side*(human?11:16)+faceShift;
   if(blink)curve([x-2,fy],[x,fy+1],[x+2,fy]);else ellipse(x,fy,2.3,sad?2.6:3,ink);
   ellipse(side*(human?21:29),fy+8,human?5:7,3,'#efc2be');
   if(sad)curve([x-3,fy-8],[x,fy-10+side],[x+3,fy-8],'#978779',1.4);
  }
  if(kind===0&&!human){ellipse(faceShift,fy+9,7.5,4,'#e9ba73',true);line([[-3+faceShift,fy+10],[3+faceShift,fy+10]],outline,1);}
  else if(kind===1&&!human){ellipse(faceShift,fy+9,10,7,'#f6ebf5');ellipse(faceShift,fy+6,2.5,1.8,ink);curve([-5+faceShift,fy+12],[faceShift,fy+15],[faceShift,fy+9]);curve([faceShift,fy+9],[faceShift,fy+15],[5+faceShift,fy+12]);}
  else{const mouth=fy+11;if(a.speaking&&(!human||a.userSpeaking)&&!reduced&&Math.sin(t*6)>.4)ellipse(faceShift,mouth,2.2,2.6,ink);else curve([-4+faceShift,mouth],[faceShift,mouth+(sad?-4:happy?5:1)],[4+faceShift,mouth]);}
  if(a.feeling==='overwhelmed')curve([33,human?-92:-35],[39,human?-81:-24],[33,human?-81:-24],'#a9c5d0',2);
  ctx.restore();
  ctx.save();ctx.textAlign='center';ctx.fillStyle=a.speaking?'#80638d':'#9c8e9f';ctx.font=`${a.speaking?'600':'400'} 12px "DM Sans", sans-serif`;const label=String(a.character.name);ctx.fillText(label.length>22?label.slice(0,21)+'…':label,a.x*width,a.y*height+62*scale);ctx.restore();
 }
 function tick(now){
  requestAnimationFrame(tick);const t=now/1000,dt=Math.min(.045,last?(now-last)/1000:1/60);last=now;if(!active||document.hidden||!canvas.clientWidth)return;
  ctx.clearRect(0,0,width,height);ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
  const count=actors.filter(a=>!a.leaving).length,scale=Math.min(count>3?1:1.24,width/(count>3?410:310),height/320);
  for(const a of actors){
   if(t>a.next&&!a.leaving&&!reduced){a.tx=clamp(a.homeX+(Math.random()-.5)*.09,.10,.9);a.ty=clamp(a.homeY+(Math.random()-.5)*.035,.48,.78);a.next=t+3+Math.random()*4;}
   const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy),rate=Math.min(.09,d*1.9);
   a.vx+=(d>.003?dx/d*rate-a.vx:-a.vx)*Math.min(1,dt*5);a.vy+=(d>.003?dy/d*rate-a.vy:-a.vy)*Math.min(1,dt*5);
   if(reduced){a.x=a.tx;a.y=a.ty;a.vx=a.vy=0;}else{a.x+=a.vx*dt;a.y+=a.vy*dt;}
   a.speed=Math.hypot(a.vx,a.vy);a.phase+=a.speed*dt*95;
   const peer=actors.find(b=>b.character.id===speaker&&b!==a);a.look=peer?Math.sign(peer.x-a.x):0;a.partnerSide=a.look||1;
  }
  actors=actors.filter(a=>!a.leaving||(a.x>-.2&&a.x<1.2));actors.sort((a,b)=>a.y-b.y).forEach(a=>draw(a,t,scale));
  const talking=actors.find(a=>a.character.id===speaker);
  if(talking){const margin=Math.min(width/2,(bubbleElement.offsetWidth||width*.75)/2+12),x=clamp(talking.x*width,margin,width-margin);bubbleElement.style.left=`${x}px`;bubbleElement.style.setProperty('--tail-x',`${clamp(talking.x*width-x,-100,100)}px`);}
 }
 requestAnimationFrame(tick);
 return {
  update(characters,beat,feelings){
   active=true;canvas.hidden=false;actorElement.classList.add('accessible-actors');speaker=beat.speaker;
   const ids=beat.onstage||[],cols=Math.min(3,ids.length),rows=Math.ceil(ids.length/3),t=performance.now()/1000;
   actors.forEach(a=>{a.leaving=!ids.includes(a.character.id);if(a.leaving)a.tx=a.x<.5?-.25:1.25;});
   ids.forEach((id,i)=>{
    const c=characters.find(c=>c.id===id);if(!c)return;const row=Math.floor(i/3),n=Math.min(cols,ids.length-row*cols),col=i%3;
    const x=(col+1)/(n+1)+(row===0?-.015:.015),y=rows===1?.66:row===0?.46:.74;
    let a=actors.find(a=>a.character.id===id);
    if(!a){a={character:c,x:reduced?x:(i%2?1.08:-.08),y,tx:x,ty:y,vx:0,vy:0,phase:0,seed:Math.random()*10,blinkAt:t+1+Math.random()*3,next:t+4};actors.push(a);}
    if(a.homeX!==x||a.homeY!==y||a.leaving){a.tx=x;a.ty=y;}
    a.homeX=x;a.homeY=y;a.leaving=false;a.character=c;a.feeling=feelings[id]||'neutral';a.speaking=id===speaker;a.userSpeaking=!!beat.userSpeaking&&id===speaker;
   });
  },
  speak(id){speaker=id;actors.forEach(a=>{a.speaking=a.character.id===id;a.userSpeaking=false;});},
  reset(){actors=[];speaker=null;ctx.clearRect(0,0,width,height);},
  snapshot(){return actors.map(a=>({id:a.character.id,x:a.x,y:a.y,speed:a.speed,feeling:a.feeling,leaving:a.leaving}));}
 };
}
window.littleStage=createLittleStage(document.getElementById('world'),document.getElementById('actors'),document.getElementById('bubble'));
