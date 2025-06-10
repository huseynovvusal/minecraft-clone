import { SimplexNoise } from "three/examples/jsm/Addons.js"
import { Chunk } from "@/Chunk"
import { AirBlock, DirtBlock, GrassBlock } from "@/Block"

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
    for (let x = 0; x < chunk.size.width; x++) {
      for (let z = 0; z < chunk.size.width; z++) {
        const worldX = chunkX * chunk.size.width + x
        const worldZ = chunkY * chunk.size.width + z
        const height = Math.floor(
          this.noise.noise(worldX * scale, worldZ * scale) * amplitude + offset
        )

        for (let y = 0; y < chunk.size.height; y++) {
          if (y < height - 1) {
            chunk.setBlock(x, y, z, new DirtBlock())
          } else if (y === height - 1) {
            chunk.setBlock(x, y, z, new GrassBlock())
          } else {
            chunk.setBlock(x, y, z, new AirBlock())
          }
        }
      }
    }
  }
}
