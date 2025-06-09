import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

import "./style.css"

import { Chunk } from "./Chunk"
import { createGUI } from "./gui"

// Renderer setup
const renderer = new THREE.WebGLRenderer({})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// Stats setup
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
camera.position.set(32, 32, 32)
// camera.lookAt(32, 32, 32)

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement)

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb) // Sky blue background

// Lighting setup
function setupLights() {
  const ambientLight = new THREE.AmbientLight()
  ambientLight.intensity = 1
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight()
  directionalLight.intensity = 1
  directionalLight.castShadow = true
  directionalLight.position.set(512, 1024, 512)
  scene.add(directionalLight)
}

//! Initialize and generate a chunk
const chunk = new Chunk()
scene.add(chunk)

// Render loop
function animate() {
  stats.begin()

  requestAnimationFrame(animate)

  renderer.render(scene, camera)

  stats.end()
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

createGUI(chunk)
setupLights()
animate()
