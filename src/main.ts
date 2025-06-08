import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

import "./style.css"

import { Chunk } from "./Chunk"
import { ChunkMesh } from "./ChunkMesh"
import { Terrain } from "./Terrain"

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
camera.lookAt(8, 8, 8)

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
  directionalLight.position.set(50, 50, 50)
  scene.add(directionalLight)
}

// Initialize and generate two chunks
const chunk1 = new Chunk()
const chunk2 = new Chunk()
const chunk3 = new Chunk()
const chunk4 = new Chunk()

// Generate terrain for both chunks
Terrain.generate(chunk1, 0, 0, 0.05, 3, 5)
Terrain.generate(chunk2, 1, 0, 0.05, 3, 5)
Terrain.generate(chunk3, 1, 1, 0.05, 3, 5)
Terrain.generate(chunk4, 1, -1, 0.05, 3, 5)

// Render the chunks as meshes
const chunkMesh1 = ChunkMesh.fromChunk(chunk1)
const chunkMesh2 = ChunkMesh.fromChunk(chunk2)
const chunkMesh3 = ChunkMesh.fromChunk(chunk3)
const chunkMesh4 = ChunkMesh.fromChunk(chunk4)

scene.add(chunkMesh1)
chunkMesh2.position.x += Chunk.SIZE // Offset the second chunk to the right
scene.add(chunkMesh2)
chunkMesh3.position.z += Chunk.SIZE // Offset the third chunk to the back
scene.add(chunkMesh3)
chunkMesh4.position.x += Chunk.SIZE // Offset the fourth chunk to the right
chunkMesh4.position.z += Chunk.SIZE // Offset the fourth chunk to the back
scene.add(chunkMesh4)

// Render loop
function animate() {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

setupLights()
animate()
