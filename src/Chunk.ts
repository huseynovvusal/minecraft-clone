import { Terrain } from "./Terrain"
import { BlockType, type Block } from "./types/block"

export class Chunk {
  static SIZE = 64
  private blocks: Block[][][] = []

  constructor() {
    this.initializeBlocks()
    this.fillTerrain()
  }

  private initializeBlocks() {
    for (let x = 0; x < Chunk.SIZE; x++) {
      this.blocks[x] = []
      for (let y = 0; y < Chunk.SIZE; y++) {
        this.blocks[x][y] = []
        for (let z = 0; z < Chunk.SIZE; z++) {
          this.blocks[x][y][z] = {
            id: 0,
            type: BlockType.Air,
          }
        }
      }
    }
  }

  public getBlock(x: number, y: number, z: number): Block {
    if (x < 0 || x >= Chunk.SIZE || y < 0 || y >= Chunk.SIZE || z < 0 || z >= Chunk.SIZE) {
      throw new Error("Block coordinates out of bounds")
    }
    return this.blocks[x][y][z]
  }

  public setBlock(x: number, y: number, z: number, block: Block): void {
    if (x < 0 || x >= Chunk.SIZE || y < 0 || y >= Chunk.SIZE || z < 0 || z >= Chunk.SIZE) {
      throw new Error("Block coordinates out of bounds")
    }
    this.blocks[x][y][z] = block
  }

  public fillTerrain() {
    Terrain.generate(this, 0, 0)
  }
}
