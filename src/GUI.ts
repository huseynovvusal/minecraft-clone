import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import type { Chunk } from "@/Chunk"

export function createGUI(chunk: Chunk) {
  const gui = new GUI()

  const terrainFolder = gui.addFolder("Terrain Parameters")
  terrainFolder.add(chunk.params.terrain, "scale", 0, 0.1, 0.01).name("Terrain Scale")
  terrainFolder.add(chunk.params.terrain, "amplitude", 0, 20, 0.1).name("Terrain Amplitude")
  terrainFolder.add(chunk.params.terrain, "offset", 0, 20, 0.1).name("Terrain Offset")

  gui.onChange(() => {
    chunk.generate()
  })
}
