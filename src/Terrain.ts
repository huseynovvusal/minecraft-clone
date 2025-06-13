import { SimplexNoise } from "three/examples/jsm/Addons.js"
import { Chunk } from "@/world/Chunk"
import { AirBlock, CoalOreBlock, DirtBlock, GrassBlock, IronOreBlock, StoneBlock } from "@/Block"
import SeedGenerator from "./SeedGenerator"
import { BlockType } from "./types/block"
import { RESOURCES } from "./constants/resources"

/**
 * Terrain class responsible for generating terrain and resources in a chunk.
 * It uses Simplex noise to create realistic terrain features.
 */
export class Terrain {
  /**
   * Generates the terrain and resources for the given chunk.
   */
  static generate(chunk: Chunk): void {
    // Generate the base terrain
    this.generateBaseTerrain(chunk)
    // Generate resources like coal and iron ores
    this.generateResources(chunk)
  }

  /**
   * Generates the base terrain for the chunk.
   */
  private static generateBaseTerrain(chunk: Chunk) {
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
          if (y < height - 1 || y < height - 5) {
            if (y / height < 0.75 + Math.random() * 0.1) {
              chunk.setBlock(x, y, z, new StoneBlock())
            } else {
              chunk.setBlock(x, y, z, new DirtBlock())
            }
          } else if (y === height - 1) {
            chunk.setBlock(x, y, z, new GrassBlock())
          } else {
            chunk.setBlock(x, y, z, new AirBlock())
          }
        }
      }
    }
  }

  /**
   * Generates resources (e.g., stone blocks) in the chunk.
   */
  private static generateResources(chunk: Chunk) {
    const seed = chunk.params.seed
    const simplex = new SimplexNoise(new SeedGenerator(seed))

    for (let x = 0; x < chunk.size.width; x++) {
      for (let y = 0; y < chunk.size.height; y++) {
        for (let z = 0; z < chunk.size.width; z++) {
          for (const blockType of RESOURCES) {
            const block = chunk.getBlock(x, y, z)

            // Skip if the block is air or grass
            if (block && [BlockType.Air, BlockType.Grass].includes(block.blockType)) {
              continue
            }

            switch (blockType) {
              case BlockType.CoalOre: {
                const coalOreBlock = new CoalOreBlock()
                const value = simplex.noise3d(
                  x * coalOreBlock.scale.x,
                  y * coalOreBlock.scale.y,
                  z * coalOreBlock.scale.z
                )
                if (value > coalOreBlock.scarcity) {
                  chunk.setBlock(x, y, z, coalOreBlock)
                }
                break
              }
              case BlockType.IronOre: {
                const ironOreBlock = new IronOreBlock()
                const value = simplex.noise3d(
                  x * ironOreBlock.scale.x,
                  y * ironOreBlock.scale.y,
                  z * ironOreBlock.scale.z
                )
                if (value > ironOreBlock.scarcity) {
                  chunk.setBlock(x, y, z, ironOreBlock)
                }
                break
              }
              default:
                break
            }
          }
        }
      }
    }
  }
}
