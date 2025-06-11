import { SimplexNoise } from "three/examples/jsm/Addons.js"
import { Chunk } from "@/Chunk"
import { AirBlock, DirtBlock, GrassBlock } from "@/Block"
import SeedGenerator from "./SeedGenerator"

export class Terrain {
  /**
   * Generates terrain for a given chunk using Simplex noise.
   */
  static generate(chunk: Chunk): void {
    const { amplitude, offset, scale } = chunk.params.terrain
    const { x: chunkX, y: chunkY } = chunk.pos

    const seed = chunk.params.seed
    const simplex = new SimplexNoise(new SeedGenerator(seed))

    for (let x = 0; x < chunk.size.width; x++) {
      for (let z = 0; z < chunk.size.width; z++) {
        const worldX = chunkX * chunk.size.width + x
        const worldZ = chunkY * chunk.size.width + z
        const height = Math.floor(
          simplex.noise(worldX * scale, worldZ * scale) * amplitude + offset
        )

        for (let y = 0; y < chunk.size.height; y++) {
          if (y < height - 1) {
            chunk.setBlock(x, y, z, new DirtBlock())
          } else if (y === height - 1) {
            chunk.setBlock(x, y, z, new GrassBlock())
          }
        }
      }
    }
  }

  private static generateResources(chunk: Chunk) {}
}
