// import '../expstyle.css'  assert { type: 'css' };
import * as THREE from 'https://cdn.skypack.dev/three';
// import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);

pointLight.position.set(5, 5, 5);

scene.add(pointLight, ambientLight);

const earthTexture = new THREE.TextureLoader().load('../static/earth.jpg');

// const normalTexture = new THREE.TextureLoader().load('normal.jpg');

// const loader = new THREE.TextureLoader();

// loader.load('earth.jpg',

// 	// onLoad callback
// 	function ( earthTexture ) {
// 		// in this example we create the material when the texture is loaded
// 		const globe = new THREE.Mesh(
//       new THREE.SphereGeometry(3.5, 50, 50),
//       new THREE.MeshBasicMaterial({
//         map: earthTexture
//         })
//     );
// 	},

// 	// onProgress callback currently not supported
// 	undefined,

// 	function ( err ) {
// 		console.error( 'An error happened.' );
// 	}
// );


const globe = new THREE.Mesh(
  new THREE.SphereGeometry(3.5, 50, 50),
  new THREE.MeshBasicMaterial({
    map: earthTexture
    })
);

globe.position.z = -5;
globe.position.y = -1;
globe.position.setX(-5);
scene.add(globe);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  //   globe.rotation.x += 0.05;
  
  globe.rotation.y -= 0.02;    
  //   globe.rotation.z += 0.05;
  // globe.rotation.y += 0.02;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

// document.body.onscroll = moveCamera;


function scrolldown() {
  const t = document.body.getBoundingClientRect().top;

  globe.rotation.y -= 0.02;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

function scrollup() {
  const t = document.body.getBoundingClientRect().top;

  globe.rotation.y += 0.02;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

// var CURRENT_SCROLL;
// $('body').scroll(function() {
//     CURRENT_SCROLL = $(this).scrollTop();
// });



// function scrollDetect(){
//   var lastScroll = 0;

//   window.onscroll = function() {
//     if(CURRENT_SCROLL > window.innerHeight) {
//       targetVector = new THREE.Vector3(0, -1, 0);
//   } else if(CURRENT_SCROLL > (window.innerHeight x 2)) {
//         targetVector = new THREE.Vector3(-1, -1, 0);
//    } else if(CURRENT_SCROLL > (window.innerHeight x 3)) {
//          targetVector = new THREE.Vector3(-1, -1, -1);
//     }
//   };
// }




function scrollDetect(){
  var lastScroll = 0;

  window.onscroll = function() {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value

      if (currentScroll > 0 && lastScroll <= currentScroll){
        lastScroll = currentScroll;
        // document.getElementById("scrollLoc").innerHTML = "Scrolling DOWN";
        scrolldown();
      }else{
        lastScroll = currentScroll;
        // document.getElementById("scrollLoc").innerHTML = "Scrolling UP";
        scrollup();
      }
  };
}

scrollDetect();

moveCamera();

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();