$(document).ready(function(){
  $(this).scrollTop(0);
});

window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
  init();
});
function showText(id, delay){
  var elem=document.getElementById(id);
  setTimeout(function(){elem.style.visibility='visible';},delay*1000)
}

window.onload = function(){
showText('header', 1);
// showText('delayedText2',0.8);
}
"use strict";

$(window).on('load', function () {
    $('.preloader').delay(350).fadeOut('slow');
});

// import '../expstyle.css'  assert { type: 'css' };
import * as THREE from 'https://cdn.skypack.dev/three';
// import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
var renderer, vShader, fShader, camera, scene, atmosphereVShader, atmosphereFShader, globe, atmosphere, v1, x, y, z;
var currentScroll = 0, totalScroll;
var loader = new THREE.FileLoader();

function init(){
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xf3f3f3);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  camera.position.setZ(30);
  camera.position.setX(-3);

  var numFilesLeft = 4;
  
  function runMoreIfDone() {
     --numFilesLeft;
     if (numFilesLeft === 0) {
       more();
     }
  }
  
  // passing shaders as string
  loader.load('../static/shaders/vertex.glsl', function ( data ) {vShader =  data; runMoreIfDone() ; },);
  loader.load('../static/shaders/fragment.glsl', function ( data ) {fShader =  data; runMoreIfDone(); },);
  loader.load('../static/shaders/atmosphereVertex.glsl', function ( data ) {atmosphereVShader =  data; runMoreIfDone() ; },);
  loader.load('../static/shaders/atmosphereFragment.glsl', function ( data ) {atmosphereFShader =  data; runMoreIfDone(); },);
}

function more() {
  renderer.render(scene, camera);
  const pointLight = new THREE.PointLight(0xffffff);
  const ambientLight = new THREE.AmbientLight(0xffffff);
  
  pointLight.position.set(5, 5, 5);
  
  scene.add(pointLight, ambientLight);

  const starGeometry = new THREE.BufferGeometry()
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
  })

  const starVertices = []
  for(let i = 0; i<10000; i++){
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = -Math.random() * 2000
    starVertices.push(x, y, z)
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)
  stars.velocity = 0;
  stars.acceleration = 0.02;
  // const normalTexture = new THREE.TextureLoader().load('normal.jpg');

  // Creating globe and adding to scene.
  globe = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: vShader,
      fragmentShader: fShader,
      uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load('../static/images/earth1.jpg')
        }
      }
    })
  );
  globe.position.z = -5;
  globe.position.y = -4;
  globe.position.setX(-10); // -5 initial
  v1 = new THREE.Vector3(-10, -4, -5);

  scene.add(globe);

  // Creating atmosphere
  atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVShader,
      fragmentShader: atmosphereFShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  );
  atmosphere.position.z = -5;
  atmosphere.position.y = -4;
  atmosphere.position.setX(-10);
  atmosphere.scale.set(1.1, 1.1, 1.1);
  // scene.add(atmosphere);

  function onWindowResize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(innerWidth, innerHeight);
  }
  window.addEventListener("resize", onWindowResize);
  
  function coord(lat, long){
    var latRad = lat * Math.PI/180;
    var longRad = -long * Math.PI/180; // takes both E and W into account
    var r = 3.5;

    x = Math.cos(latRad) * Math.cos(longRad) * r;
    y = Math.sin(latRad) * r;
    z = Math.cos(latRad) * Math.sin(longRad) * r;
    // return [x, y, z];
    return {x, y, z};
  }

  function addPoints(lat, long){
    var point = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 50, 50), new THREE.MeshBasicMaterial({color: 0x00ff00})
    )
    // const [x, y, z] = Array(3).fill().map(()=>coord(7.9465, 1.0232));
    let {x, y, z} = coord(lat, long);
    point.position.set(x, y, z);
    globe.add(point);
  }
  // gs.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

  // var phi = (90 - lat) * (Math.PI / 180);
  // var theta = (long + 180) * (Math.PI / 180);
  // point.position.x = -(Math.sin(phi)*Math.cos(theta));
  // point.position.z = (Math.sin(phi)*Math.sin(theta));
  // point.position.y = Math.cos(phi);
  
  

  // addPoints(7.9465, 1.0232);
  // 7.9465, 1.0232

  const t = document.body.getBoundingClientRect().top;
  //   globe.rotation.x += 0.05;
  //   globe.rotation.z += 0.05;
  // globe.rotation.y -= 0.02; // 1.4
  totalScroll = 280;
  currentScroll = 280;
  globe.rotation.y = Math.PI * currentScroll / totalScroll;

  atmosphere.rotation.y -= 0.02;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002; 
  
  function rotgr700(currentScroll, totalScroll){
    globe.rotation.y = Math.PI * currentScroll / totalScroll;
    console.log(globe.rotation.y);
    // globe.rotation.x += 0.002;
  }

  function india(){
    var coordinates = [11.059821, 78.387451, 17.123184, 79.208824, 23.473324, 77.947998, 29.238478, 76.431885, 21.295132, 81.828232, 
      29.065773, 76.040497, 25.794033, 78.116531, 19.601194, 75.552979, 23.745127, 91.746826, 17.874857,78.100815, 15.317277, 
      75.71389, 10.850516,76.27108, 28.207609, 79.82666, 26.244156, 92.537842, 19.66328, 75.300293, 11.127123, 78.656891, 
      15.317277, 75.71389, 22.978624, 87.747803, 22.309425, 72.13623, 20.94092, 84.803467, 27.391277, 73.432617, 32.084206, 77.571167]
  
    for (let i = 0; i < coordinates.length-1; i+=2) {
      addPoints(coordinates[i], coordinates[i+1]);
    }
  }

  function rotgr1500(){
    globe.rotation.y -= 0.02;
    // globe.rotation.x -= 0.02;
  }

  function scrolldown(currentScroll, totalScroll) {
    const t = document.body.getBoundingClientRect().top;
  
    // globe.rotation.y -= 0.02;
    globe.rotation.y = Math.PI * currentScroll / totalScroll;
    atmosphere.rotation.y -= 0.02;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
  }
  
  function scrollup() {
    const t = document.body.getBoundingClientRect().top;
  
    globe.rotation.y += 0.02;
    atmosphere.rotation.y += 0.02;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
  }

  function scrollup15() {  
    globe.rotation.y += 0.02;
    // atmosphere.rotation.y += 0.02;
  }
  function scrollup7() {  
    globe.rotation.y += 0.02;
    // atmosphere.rotation.y += 0.02;
  }

  function scrolldownwithout() {
    globe.rotation.y -= 0.02;
    atmosphere.rotation.y -= 0.02;
  }
  
  var scroll = 0;
  var lastScroll = 0;
  
  window.addEventListener("scroll", (event) => {
    scroll = window.scrollY;
    console.clear();
    console.log("scroll: ", scroll)
    if (scroll > 0 && lastScroll <= scroll && scroll <= 280){
      lastScroll = scroll;
      currentScroll = 280 - scroll;
      totalScroll = 280;
      scrolldown(currentScroll, totalScroll);
    } else if(scroll > 0 && lastScroll <= scroll && scroll > 280 && scroll <= 700){
      lastScroll = scroll;
    } else if(scroll > 0 && lastScroll <= scroll && scroll > 700 && scroll < 1000){
      lastScroll = scroll;
      currentScroll = 1000 - scroll;
      totalScroll = 300;
      rotgr700(currentScroll, totalScroll);
    } else if(scroll > 0 && lastScroll <= scroll && scroll >= 1000 && scroll <= 1500){
      lastScroll = scroll;
      india();
    } else if(scroll > 0 && lastScroll <= scroll && scroll > 1500){
      lastScroll = scroll;
      rotgr1500();
    } else if(scroll > 0 && lastScroll >= scroll && scroll > 1500){
      lastScroll = scroll;
      scrollup15();
    } else if(scroll > 0 && lastScroll >= scroll && scroll > 1100 && scroll <= 1500){
      lastScroll = scroll;
    } else if(scroll > 0 && lastScroll >= scroll && scroll > 700 && scroll <= 1100){
      lastScroll = scroll;
      scrollup7();
    } else if(scroll > 0 && lastScroll >= scroll && scroll > 280 && scroll <= 700){
      lastScroll = scroll;
    } else{
      lastScroll = scroll;
      scrollup();
    }
  });
  
  if(window.innerWidth < 600){
    camera.position.z = 10;
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  // 400 < window.pageYOffset < 600
  // const currentTimeline = 400 < (window.pageYOffset) &&  (window.pageYOffset)< 600;
  // const rx = currentTimeline * Math.PI * 2;
  // const ry = currentTimeline * Math.PI * 2;
  
  // globe.rotation.set(0, ry, 0);

  // starGeo.vertices.forEach(p => {
  //   p.velocity += p.acceleration
  //   p.y -= p.velocity;
    
  //   if (p.y < -200) {
  //     p.y = 200;
  //     p.velocity = 0;
  //   }
  // });
  // starGeo.verticesNeedUpdate = true; 

  const v2 = new THREE.Vector3(-5, -1, -5);
  globe.position.lerp(v2, 0.01);
  // globe.setFromEuler.rotation.lerp(v2, 0.01);
  // globe.quaternion.slerp(v1, v2, 0.01);
  atmosphere.position.lerp(v2, 0.01);
  renderer.render(scene, camera);
}