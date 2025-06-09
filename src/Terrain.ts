import { SimplexNoise } from "three/examples/jsm/Addons.js"
import { Chunk } from "@/Chunk"
import { AirBlock, DirtBlock, GrassBlock } from "@/Block"
import * as THREE from "three"

export class Terrain {
  private static noise = new SimplexNoise()

  static generate(
    chunk: Chunk,
    chunkX: number,
    chunkY: number,
    scale: number = 0.02,
    amplitude: number = 5,
    offset: number = 10
  ): void {
    for (let x = 0; x < Chunk.SIZE; x++) {
      for (let z = 0; z < Chunk.SIZE; z++) {
        const worldX = chunkX * Chunk.SIZE + x
        const worldZ = chunkY * Chunk.SIZE + z
        const height = Math.floor(
          this.noise.noise(worldX * scale, worldZ * scale) * amplitude + offset
        )

        for (let y = 0; y < Chunk.SIZE; y++) {
          const pos = new THREE.Vector3(x, y, z)
          if (y < height - 1) {
            chunk.setBlock(x, y, z, new DirtBlock(chunk, 1, pos))
          } else if (y === height - 1) {
            chunk.setBlock(x, y, z, new GrassBlock(chunk, 2, pos))
          } else {
            chunk.setBlock(x, y, z, new AirBlock(chunk, pos))
          }
        }
      }
    }
  }
}
