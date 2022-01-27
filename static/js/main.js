window.addEventListener('load', (event) => {
  console.log('page is fully loaded');
});

"use strict";

$(window).on('load', function () {
    $('.preloader').delay(350).fadeOut('slow');
});

// import '../expstyle.css'  assert { type: 'css' };
import * as THREE from 'https://cdn.skypack.dev/three';
// import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
var renderer, vShader, fShader, camera, scene, atmosphereVShader, atmosphereFShader, globe;
var loader = new THREE.FileLoader();

init();

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
  globe.position.y = -1;
  globe.position.setX(-5);
  scene.add(globe);

  // Creating atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVShader,
      fragmentShader: atmosphereFShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  );
  atmosphere.position.z = -5;
  atmosphere.position.y = -1;
  atmosphere.position.setX(-5);
  atmosphere.scale.set(1.1, 1.1, 1.1);
  scene.add(atmosphere);

  function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    //   globe.rotation.x += 0.05;
    
    globe.rotation.y -= 0.02;
    atmosphere.rotation.y -= 0.02;   

    //   globe.rotation.z += 0.05;
    // globe.rotation.y += 0.02;
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
  }
  
  // document.body.onscroll = moveCamera; // DOUBT IN THIS
  
  function scrolldown() {
    const t = document.body.getBoundingClientRect().top;
  
    globe.rotation.y -= 0.02;
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
    if (scroll > 0 && lastScroll <= scroll && scroll < 280){ // do 320 and check
      lastScroll = scroll;
      scrolldown();
    } else if(scroll > 0 && lastScroll <= scroll && scroll > 280 && scroll < 700){
      lastScroll = scroll;
    } else if(scroll > 0 && lastScroll <= scroll && scroll > 700){
      lastScroll = scroll;
      scrolldown();
    }
    else{
      lastScroll = scroll;
      scrollup();
    }
  });
  
  moveCamera();
  
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}