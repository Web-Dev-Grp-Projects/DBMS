import * as THREE from 'https://cdn.skypack.dev/three';
// import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { gl_Position } from '../shaders/vertex.glsl'
// import vitePluginCdn from 'https://cdn.skypack.dev/vite-plugin-cdn';
// import vertexShader from '../shaders/vertex.glsl' assert {type: 'octet-stream'}
var renderer, vShader, fShader, camera, scene, atmosphereVShader, atmosphereFShader, sphere;
var loader = new THREE.FileLoader();
// var vShader;
// vShader = document.getElementById('vertexShader').textContent;
// console.log(vShader);

init();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 15;

  var numFilesLeft = 4;
  
  function runMoreIfDone() {
     --numFilesLeft;
     if (numFilesLeft === 0) {
       more();
     }
  }
  
  loader.load('../static/shaders/vertex.glsl', function ( data ) {vShader =  data; runMoreIfDone() ; },);
  loader.load('../static/shaders/fragment.glsl', function ( data ) {fShader =  data; runMoreIfDone(); },);
  loader.load('../static/shaders/atmosphereVertex.glsl', function ( data ) {atmosphereVShader =  data; runMoreIfDone() ; },);
  loader.load('../static/shaders/atmosphereFragment.glsl', function ( data ) {atmosphereFShader =  data; runMoreIfDone(); },);
}

function more() {
  // const normalTexture = new THREE.TextureLoader().load('normal.jpg');
  
  // Creating sphere and adding to scene.
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
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

  scene.add(sphere);
  
  // Creating atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVShader,
      fragmentShader: atmosphereFShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  );
  
  atmosphere.scale.set(1.1, 1.1, 1.1);
  scene.add(atmosphere);
  
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  
  renderer.render(scene, camera);
  sphere.rotation.y += 0.001;
}