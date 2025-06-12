import * as THREE from "three"

import { Block } from "@/Block"
import { Terrain } from "@/Terrain"
import { BlockType } from "@/types/block"
import BlockStorage from "./BlockStorage"
import type { IChunk } from "./types/chunk"

export class Chunk implements IChunk {
  public readonly pos: THREE.Vector2 = new THREE.Vector2(0, 0)

  public size = {
    width: 64,
    height: 32,
  }
  public params = {
    seed: 0,
    terrain: {
      scale: 0.02,
      amplitude: 20,
      offset: 20,
    },
  }

  private blocks: BlockStorage = new BlockStorage(
    this.size.width,
    this.size.height,
    this.size.width
  )

  /**
   * This method clears previous blocks and fills the terrain anew.
   */
  public getBlock(x: number, y: number, z: number): Block | null {
    if (
      x < 0 ||
      x >= this.size.width ||
      y < 0 ||
      y >= this.size.height ||
      z < 0 ||
      z >= this.size.width
    ) {
      // throw new Error("Block coordinates out of bounds")
      // console.warn(`Block coordinates out of bounds: (${x}, ${y}, ${z})`)

      return null
    }

    return this.blocks.getBlock(x, y, z) || null
  }

  /**
   * Sets a block at the specified coordinates in the chunk.
   */
  public setBlock(x: number, y: number, z: number, block: Block): void {
    if (
      x < 0 ||
      x >= this.size.width ||
      y < 0 ||
      y >= this.size.height ||
      z < 0 ||
      z >= this.size.width
    ) {
      throw new Error("Block coordinates out of bounds")
    }

    this.blocks.setBlock(x, y, z, block)
    // this.blocks[x][y][z] = block
  }

  /**
   * Checks if a block at the specified coordinates is visible.
   * A block is considered visible if it is not air and has at least one neighbor that is air.
   */
  public isBlockVisible(x: number, y: number, z: number): boolean {
    const block = this.getBlock(x, y, z)

    if (!block || block.blockType === BlockType.Air) {
      return false
    }

    // Directions to check for neighbors: [x, y, z]
    const directions = [
      [1, 0, 0], // right (x+)
      [-1, 0, 0], // left (x-)
      [0, 1, 0], // top (y+)
      [0, -1, 0], // bottom (y-)
      [0, 0, 1], // front (z+)
      [0, 0, -1], // back (z-)
    ]

    for (const [dx, dy, dz] of directions) {
      const nx = x + dx
      const ny = y + dy
      const nz = z + dz

      const neighborBlock = this.getBlock(nx, ny, nz)

      if (!neighborBlock || neighborBlock?.blockType === BlockType.Air) {
        return true
      }
    }

    return false
  }

  /**
   * Clears all blocks in the chunk.
   */
  public clear() {
    this.blocks.clear()
  }

  /**
   * Generates the terrain for the chunk based on the parameters.
   * This method clears previous blocks and fills the terrain anew.
   */
  public generate() {
    this.blocks.clear() // Clear previous blocks
    Terrain.generate(this)
  }
}
