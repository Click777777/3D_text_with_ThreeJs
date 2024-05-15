import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

/**
 * Canvas
 */
const canvas = document.querySelector(".webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Size of screen
 */
const sizeOfScreen = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * 3D Text
 */
// Texture
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

// Loader
const loader = new FontLoader();
loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Geometry
  const geometry = new TextGeometry("Happy Coding", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  geometry.center();

  // Material
  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;

  // Mesh
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  /**
   * Donuts
   */
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 100);

  const numberOfDonut = 100;

  for (let i = 0; i < numberOfDonut; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    const donutScale = Math.random();

    donut.scale.set(donutScale, donutScale, donutScale);
    scene.add(donut);
  }
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizeOfScreen.width / sizeOfScreen.height
);
camera.position.set(0, 0, 4);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizeOfScreen.width, sizeOfScreen.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Responsive Screen
 */
window.addEventListener("resize", () => {
  // Update Screen Size
  sizeOfScreen.width = window.innerWidth;
  sizeOfScreen.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizeOfScreen.width / sizeOfScreen.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizeOfScreen.width, sizeOfScreen.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Zoom IN and OUT with Double click
 */
document.addEventListener("dblclick", () => {
  const fullScreen =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullScreen) {
    if (canvas.requestFullscreen) {
      // normal browser (google)
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      // prefiexed (safari)
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      // normal browser (google)
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // prefiexed (safari)
      document.webkitExitFullscreen();
    }
  }
});

/**
 * Control
 */
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

/**
 * Tick or Animation
 */
const clock = new THREE.Clock();
const tick = () => {
  //elapsed time
  const elapsedTime = clock.getElapsedTime();

  // Control
  control.update();

  // Rednerer
  renderer.render(scene, camera);

  // Call tick for next frame
  window.requestAnimationFrame(tick);
};
tick();
