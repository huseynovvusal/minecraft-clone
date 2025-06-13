import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import type { Chunk } from "@/world/Chunk"
import type { ChunkRenderer } from "@/rendering/ChunkRenderer"

export function createGUI(chunk: Chunk, chunkRenderer: ChunkRenderer): void {
  const gui = new GUI()

  const terrainFolder = gui.addFolder("Terrain Parameters")
  terrainFolder.add(chunk.params, "seed", 0, 10000, 1).name("Seed")
  terrainFolder.add(chunk.params.terrain, "scale", 0, 0.1, 0.01).name("Terrain Scale")
  terrainFolder.add(chunk.params.terrain, "amplitude", 0, 20, 0.1).name("Terrain Amplitude")
  terrainFolder.add(chunk.params.terrain, "offset", 0, 20, 0.1).name("Terrain Offset")

  gui.onChange(() => {
    chunk.generate()
    chunkRenderer.render()
  })
}
