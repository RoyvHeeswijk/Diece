import * as THREE from "three"
import "./style.css"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
//scene
const scene = new THREE.Scene()
//maken van ronde
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const loader = new THREE.TextureLoader();
 
   const cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: loader.load('assets/1.png') }), //right side
    new THREE.MeshBasicMaterial({ map: loader.load('assets/2.png')}), //left side
    new THREE.MeshBasicMaterial({ map: loader.load('assets/3.png')}), //top side
    new THREE.MeshBasicMaterial({ map: loader.load('assets/4.png')}), //bottom side
    new THREE.MeshBasicMaterial({ map: loader.load('assets/5.png')}), //front side
    new THREE.MeshBasicMaterial({ map: loader.load('assets/6.png')}), //back side
];
const cube = new THREE.Mesh( geometry, cubeMaterials); 
scene.add( cube );

//grootte
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Rotation variables
let isSpinning = false;
let rotationSpeedX = 0.2;
let rotationSpeedY = 0.2;

// de functie word geopend
const alignCube = () => {
  cube.quaternion.set(0, 0, 0, 1);
  // dobbelsteen kijkt naar beneden
  cube.rotateX(Math.PI / 2);
};

// stopt de dobbelsteen met draaien
const stopCubeAligned = () => {
  const targetRotations = [
    { x: 0, y: 0, z: 0 }, 
    { x: Math.PI / 2, y: 0, z: 0 }, 
    { x: -Math.PI / 2, y: 0, z: 0 }, 
    { x: 0, y: Math.PI / 2, z: 0 }, 
    { x: 0, y: -Math.PI / 2, z: 0 }, 
    { x: Math.PI, y: 0, z: 0 } 
  ];

  let closestRotation = targetRotations[0];
  let closestDistance = Infinity;

  targetRotations.forEach(rotation => {
    const distance = Math.abs(cube.rotation.x - rotation.x) + Math.abs(cube.rotation.y - rotation.y) + Math.abs(cube.rotation.z - rotation.z);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestRotation = rotation;
    }
  });

  gsap.to(cube.rotation, {
    duration: 2,
    x: closestRotation.x,
    y: closestRotation.y,
    z: closestRotation.z,
    ease: "power3.inOut",
    onComplete: () => {
      isSpinning = false;
    }
  });
};

//de knop
const button = document.getElementById('deknop');
button.addEventListener('click', function() {
  isSpinning = true;

  determineFacingFace();
  setTimeout(() => {
    isSpinning = false;
    stopCubeAligned();

  }, Math.random() * (5000 - 2000));
 
});



//lichten
const light = new THREE.PointLight(0xffffff, 80, 150, 1.9)
light.position.set(0, 10, 10)
light.intensity = 125
scene.add(light)


//ontwikkelen van camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 1
scene.add(camera)


//rendering the scene
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(5);
renderer.render(scene, camera)



//hergroteren
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //camera updaten
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})
//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
// automatisch roteren 
//controls.autoRotate = true
// rotatie snelheid aanpassen 
//controls.autoRotateSpeed = 5

// Function to determine which face is facing the camera
const determineFacingFace = () => {
  const faceNormals = [
    new THREE.Vector3(1, 0, 0), // right side
    new THREE.Vector3(-1, 0, 0), // left side
    new THREE.Vector3(0, 1, 0), // top side
    new THREE.Vector3(0, -1, 0), // bottom side
    new THREE.Vector3(0, 0, 1), // front side
    new THREE.Vector3(0, 0, -1), // back side
  ];

  const cubeWorldPosition = new THREE.Vector3();
  cube.getWorldPosition(cubeWorldPosition);

  const cameraWorldPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraWorldPosition);

  const direction = new THREE.Vector3();
  direction.subVectors(cubeWorldPosition, cameraWorldPosition).normalize();

  let maxDot = -Infinity;
  let facingIndex = -1;

  for (let i = 0; i < faceNormals.length; i++) {
    const faceNormal = faceNormals[i].clone().applyQuaternion(cube.quaternion);
    const dot = faceNormal.dot(direction);
    if (dot > maxDot) {
      maxDot = dot;
      facingIndex = i;
    }
  }

// const faceNames = ["3", "6", "2", "5", "1", "4"];
//  alert(` ${faceNames[facingIndex]} je hebt ${faceNames[facingIndex]} gegooid`);
};

//loop

const loop = () => {
  if (isSpinning) {
    cube.rotation.x += rotationSpeedX;
    cube.rotation.y += rotationSpeedY;
  }
  controls.update()
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();
alignCube();

// timeline magic
//const t1 = gsap.timeline({ defaults: { duration: 1 } })
//t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
///t1.fromTo("nav", { y: "-100%" }, { y: "0%" })
//t1.fromTo(".title", { opacity: 0 }, { opacity: 1 })

//Mouse Animation Color
//let mouseDown = false
//let rgb = []
//window.addEventListener("mousedown", () => (mouseDown = true))
//window.addEventListener("mouseup", () => (mouseDown = false))

//window.addEventListener('mousemove', (e) => {
 // if (mouseDown) {
  //  rgb = [
  //    Math.round((e.pageX / sizes.width) * 255),
   //   Math.round((e.pageY / sizes.height) * 255),
   //   150,
  //  ]
    //animeren
 //   let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
 //   gsap.to(mesh.material.color, {
 //     r: newColor.r, 
  //    g: newColor.g, 
  //    b: newColor.b,
 //   })
 // }
//})

