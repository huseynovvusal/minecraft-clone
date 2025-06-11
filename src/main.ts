import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

import "@/styles/style.css"

import { Chunk } from "@/Chunk"
import { createGUI } from "@/GUI"
import TextureManager from "./TextureManager"

//
await TextureManager.getInstance()
  .loadTextures()
  .then(() => {
    console.log("Textures loaded successfully")
  })

// Renderer setup
const renderer = new THREE.WebGLRenderer({})

renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
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
// @ts-ignore
const controls = new OrbitControls(camera, renderer.domElement)

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb) // Sky blue background
scene.castShadow = true
scene.receiveShadow = true
// scene.fog = new THREE.FogExp2(0x87ceeb, 0.02) // Fog effect

// Lighting setup
function setupLights() {
  // Ambient light setup
  const ambientLight = new THREE.AmbientLight()
  ambientLight.intensity = 0.25
  scene.add(ambientLight)

  // Directional light setup
  const directionalLight = new THREE.DirectionalLight()
  directionalLight.castShadow = true

  directionalLight.position.set(50, 50, 50)

  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 50
  directionalLight.shadow.camera.bottom = -50
  directionalLight.shadow.camera.near = 0.1
  directionalLight.shadow.camera.far = 100
  directionalLight.shadow.bias = -0.01

  directionalLight.shadow.mapSize = new THREE.Vector2(512, 512) // Higher resolution for shadows

  scene.add(directionalLight)

  // Shadow helpers for debugging
  const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  scene.add(directionalLightHelper)
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
