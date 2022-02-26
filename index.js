var C=Object.defineProperty;var E=(d,e,i)=>e in d?C(d,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):d[e]=i;var a=(d,e,i)=>(E(d,typeof e!="symbol"?e+"":e,i),i);import{W as z,S,P as U,C as F,V,M as f,a as A,b,c as R,d as m,G as B,e as G,T as k,L as W,F as c,f as w,g as H,h as N,i as K,D as O}from"./vendor.js";const Q=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function i(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerpolicy&&(s.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?s.credentials="include":t.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=i(t);fetch(t.href,s)}};Q();class j{constructor(e=60,i=1.333,r=1,t=1e3){a(this,"aspectRatio");a(this,"fov");a(this,"znear");a(this,"zfar");a(this,"renderer");a(this,"scene");a(this,"camera");a(this,"clock");this.fov=e,this.aspectRatio=i,this.znear=r,this.zfar=t,this.renderer=new z,this.renderer.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(this.renderer.domElement),this.resize(),window.addEventListener("resize",()=>{this.resize()},!1),window.addEventListener("mousedown",s=>{this.onMouseDown(s)}),window.addEventListener("mouseup",s=>{this.onMouseUp(s)}),window.addEventListener("mousemove",s=>{this.onMouseMove(s)}),window.addEventListener("keydown",s=>{this.onKeyDown(s)}),window.addEventListener("keyup",s=>{this.onKeyUp(s)}),this.scene=new S,this.camera=new U(this.fov,this.aspectRatio,this.znear,this.zfar),this.clock=new F}start(){this.createScene(),this.mainLoop()}mainLoop(){this.update(this.clock.getDelta()),this.renderer.render(this.scene,this.camera),window.requestAnimationFrame(()=>this.mainLoop())}resize(){this.renderer.setSize(window.innerWidth,window.innerHeight);var e=new V;this.renderer.getViewport(e);var i=window.innerWidth/window.innerHeight;this.aspectRatio>i?this.renderer.setViewport(0,(window.innerHeight-window.innerWidth/this.aspectRatio)/2,window.innerWidth,window.innerWidth/this.aspectRatio):this.renderer.setViewport((window.innerWidth-window.innerHeight*this.aspectRatio)/2,0,window.innerHeight*this.aspectRatio,window.innerHeight)}onMouseDown(e){}onMouseUp(e){}onMouseMove(e){}onKeyDown(e){}onKeyUp(e){}}class v extends f{constructor(e,i,r){super();a(this,"startTime");a(this,"duration");a(this,"magnitude");this.startTime=i.date.getTime(),this.magnitude=i.normalizedMagnitude,this.duration=r,this.position.copy(e),this.geometry=new A(.1*this.magnitude);var t=new b;t.color=new R(1*this.magnitude,1-this.magnitude,0),this.material=t}getPlaybackLife(e){return m.clamp(Math.abs(e/1e3-this.startTime/1e3)/this.duration,0,1)}}class Y extends B{constructor(){super();a(this,"earthMesh");a(this,"earthMaterial");a(this,"debugMaterial");a(this,"vertices");a(this,"sphere_vertices");a(this,"normals");a(this,"sphere_normals");a(this,"globeMode");a(this,"alpha");a(this,"morph_me");this.earthMesh=new f,this.earthMaterial=new b,this.debugMaterial=new G,this.vertices=[],this.sphere_vertices=[],this.normals=[],this.sphere_normals=[],this.globeMode=!1,this.alpha=0,this.morph_me=!1}initialize(){this.earthMaterial.map=new k().load("./data/earth-1k.png"),this.earthMaterial.map.minFilter=W,this.earthMesh.material=this.earthMaterial,this.debugMaterial.wireframe=!0;var e=-Math.PI,i=Math.PI/2,r=2*Math.PI/80,t=Math.PI/80;for(let h=0;h<=80;h++)for(let o=0;o<=80;o++)this.vertices.push(e+r*o,i-t*h,0);for(let h=0;h<6561*3;h=h+3){var s=this.vertices[h],n=this.vertices[h+1],u=this.rescale(s,-Math.PI,Math.PI,-180,180)*Math.PI/180,p=this.rescale(n,-Math.PI/2,Math.PI/2,-90,90)*Math.PI/180,y=Math.cos(p)*Math.sin(u),_=Math.sin(p),T=Math.cos(p)*Math.cos(u);this.sphere_vertices.push(y,_,T)}for(let h=0;h<6561;h++)this.normals.push(0,0,1);for(let h=0;h<6561;h++)this.sphere_normals.push(this.sphere_vertices[h]);var D=1,x=0,L=82,I=82,q=0,P=81,g=[];for(let h=0;h<80;h++){var l=h*81;for(let o=0;o<80;o++)g.push(D+o+l,x+o+l,L+o+l),g.push(I+o+l,q+o+l,P+o+l)}var M=[];for(let h=0;h<=80;h++)for(let o=0;o<=80;o++)M.push(.0125*o,1-.0125*h);this.earthMesh.geometry.setAttribute("position",new c(this.vertices,3)),this.earthMesh.geometry.setAttribute("normal",new c(this.normals,3)),this.earthMesh.geometry.setAttribute("uv",new c(M,2)),this.earthMesh.geometry.setIndex(g),this.add(this.earthMesh)}rescale(e,i,r,t,s){return t+(s-t)*(e-i)/(r-i)}update(e){this.morph_me&&this.morph(e)}morph(e){if(this.alpha+=e,this.alpha>1){this.morph_me=!1,this.alpha=0;return}var i=[],r=[];if(this.globeMode==!0)for(let t=0;t<6561;t++)r.push(m.lerp(this.vertices[t],this.sphere_vertices[t],this.alpha)),i.push(m.lerp(this.normals[t],this.sphere_normals[t],this.alpha));if(this.globeMode==!1)for(let t=0;t<6561;t++)r.push(m.lerp(this.sphere_vertices[t],this.vertices[t],this.alpha)),i.push(m.lerp(this.sphere_normals[t],this.normals[t],this.alpha));this.earthMesh.geometry.setAttribute("position",new c(r,3)),this.earthMesh.geometry.setAttribute("normal",new c(i,3))}animateEarthquakes(e){this.children.forEach(i=>{i instanceof v&&i.getPlaybackLife(e)==1&&this.remove(i)})}createEarthquake(e){if(this.globeMode)var r=this.convertLatLongToSphere(e.latitude,e.longitude);else var r=this.convertLatLongToPlane(e.latitude,e.longitude);var t=new v(r,e,29030400);this.add(t)}convertLatLongToPlane(e,i){var r=e/90,t=i/180,s=t*Math.PI,n=r*(Math.PI/2);return new w(s,n,0)}convertLatLongToSphere(e,i){var r=e*Math.PI/180,t=i*Math.PI/180,s=Math.cos(r)*Math.sin(t),n=Math.sin(r),u=Math.cos(r)*Math.cos(t);return new w(s,n,u)}toggleDebugMode(e){e?this.earthMesh.material=this.debugMaterial:this.earthMesh.material=this.earthMaterial}}class ${constructor(e){a(this,"date");a(this,"longitude");a(this,"latitude");a(this,"magnitude");a(this,"normalizedMagnitude");this.date=new Date,this.date.setUTCFullYear(parseInt(e.substring(12,16))),this.date.setUTCMonth(parseInt(e.substring(17,19))),this.date.setUTCDate(parseInt(e.substring(20,22))),this.date.setUTCHours(parseInt(e.substring(24,26))),this.date.setUTCMinutes(parseInt(e.substring(27,29))),this.date.setUTCSeconds(parseFloat(e.substring(30,35))),this.longitude=parseFloat(e.substring(44,52)),this.latitude=parseFloat(e.substring(37,44)),this.magnitude=parseFloat(e.substring(66,70)),this.normalizedMagnitude=this.magnitude}}class J{constructor(e){a(this,"earthquakes");a(this,"loaded");a(this,"maxMagnitude");a(this,"minMagnitude");a(this,"nextIndex");this.earthquakes=[],this.loaded=!1,this.maxMagnitude=0,this.minMagnitude=1/0,this.nextIndex=0;var i=new H;i.load(e,r=>{var t=r.toString().split(`
`);t.forEach(s=>{if(s.length>30){var n=new $(s);this.earthquakes.push(n),n.magnitude>this.maxMagnitude?this.maxMagnitude=n.magnitude:n.magnitude<this.minMagnitude&&(this.minMagnitude=n.magnitude)}}),this.earthquakes.forEach(s=>{s.normalizedMagnitude=(s.magnitude-this.minMagnitude)/(this.maxMagnitude-this.minMagnitude)}),this.loaded=!0})}reset(){this.nextIndex=0}getNextQuake(e){for(var i=e.getTime();this.nextIndex<this.earthquakes.length;)return this.earthquakes[this.nextIndex].date.getTime()<i?(this.nextIndex++,this.earthquakes[this.nextIndex-1]):null;return null}getMaxTime(){return this.earthquakes[this.earthquakes.length-1].date.getTime()}getMinTime(){return this.earthquakes[0].date.getTime()}}class X extends j{constructor(){super(60,1920/1080,.1,50);a(this,"earth");a(this,"gui");a(this,"earthquakeDB");a(this,"currentTime");a(this,"mouseDrag");a(this,"mouseVector");a(this,"date");a(this,"viewMode");a(this,"playbackSpeed");a(this,"debugMode");this.gui=new N,this.earth=new Y,this.earthquakeDB=new J("./data/earthquakes.txt"),this.currentTime=1/0,this.mouseDrag=!1,this.mouseVector=new K,this.date="",this.viewMode="Map",this.playbackSpeed=.5,this.debugMode=!1}createScene(){this.camera.position.set(0,0,3.25),this.camera.lookAt(0,0,0),this.camera.up.set(0,1,0);var e=new O("white",1.5);e.position.set(10,10,15),this.scene.add(e),this.scene.background=new k().load("./data/stars.png"),this.earth.initialize(),this.scene.add(this.earth);var i=this.gui.addFolder("Earthquake Controls"),r=i.add(this,"date");r.name("Current Date"),r.listen();var t=i.add(this,"viewMode",{Map:"Map",Globe:"Globe"});t.name("View Mode"),t.onChange(u=>{u=="Map"&&(this.earth.globeMode=!1,this.earth.morph_me=!0),u=="Globe"&&(this.earth.morph_me=!0,this.earth.globeMode=!0)});var s=i.add(this,"playbackSpeed",0,1);s.name("Playback Speed");var n=i.add(this,"debugMode");n.name("Debug Mode"),n.onChange(u=>{this.toggleDebugMode(u)}),this.gui.width=300,i.open()}update(e){if(!this.earthquakeDB.loaded)return;const i=3e10;this.currentTime+=i*this.playbackSpeed*e,this.currentTime>this.earthquakeDB.getMaxTime()&&(this.currentTime=this.earthquakeDB.getMinTime(),this.earthquakeDB.reset());var r=new Date;r.setTime(this.currentTime),this.date=r.getUTCMonth()+"/"+r.getUTCDate()+"/"+r.getUTCFullYear();for(var t=this.earthquakeDB.getNextQuake(r);t;)this.earth.createEarthquake(t),t=this.earthquakeDB.getNextQuake(r);this.earth.update(e),this.earth.animateEarthquakes(this.currentTime)}toggleDebugMode(e){this.earth.toggleDebugMode(e)}onMouseDown(e){this.mouseDrag=!0}onMouseUp(e){this.mouseDrag=!1}onMouseMove(e){this.mouseDrag,this.mouseVector.set(e.x,e.y)}}var Z=new X;Z.start();
