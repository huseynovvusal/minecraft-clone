import * as THREE from "three"

import { AirBlock, type Block } from "./Block"
import { Terrain } from "./Terrain"
import { BlockType } from "./types/block"

export class Chunk extends THREE.Group {
  static SIZE = 16
  private blocks: Block[][][] = []

  public params = {
    terrain: {
      scale: 0.05,
      amplitude: 5,
      offset: 10,
    },
  }

  constructor() {
    super()

    this.initializeBlocks()
    this.generate()
  }

  private initializeBlocks() {
    for (let x = 0; x < Chunk.SIZE; x++) {
      this.blocks[x] = []
      for (let y = 0; y < Chunk.SIZE; y++) {
        this.blocks[x][y] = []
        for (let z = 0; z < Chunk.SIZE; z++) {
          this.blocks[x][y][z] = new AirBlock()
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
    Terrain.generate(
      this,
      0,
      0,
      this.params.terrain.scale,
      this.params.terrain.amplitude,
      this.params.terrain.offset
    )
  }

  public isBlockVisible(x: number, y: number, z: number): boolean {
    const block = this.getBlock(x, y, z)

    if (block.blockType === BlockType.Air) {
      return false
    }

    // Directions to check for neighbors: [x, y, z]
    const directions = [
      [1, 0, 0], // right (x+)
      [-1, 0, 0], // left (x-)
      [0, 1, 0], // up (y+)
      [0, -1, 0], // down (y-)
      [0, 0, 1], // front (z+)
      [0, 0, -1], // back (z-)
    ]

    for (const [dx, dy, dz] of directions) {
      const nx = x + dx
      const ny = y + dy
      const nz = z + dz

      if (nx < 0 || nx >= Chunk.SIZE || ny < 0 || ny >= Chunk.SIZE || nz < 0 || nz >= Chunk.SIZE) {
        return true
      }

      if (this.getBlock(nx, ny, nz).blockType === BlockType.Air) {
        return true
      }
    }

    return false
  }

  private generateMeshes(): void {
    const group = new THREE.Group()

    for (let x = 0; x < Chunk.SIZE; x++) {
      for (let y = 0; y < Chunk.SIZE; y++) {
        for (let z = 0; z < Chunk.SIZE; z++) {
          const block = this.getBlock(x, y, z)

          if (!this.isBlockVisible(x, y, z)) continue

          let color = 0x00ff00
          let transparent = false
          let opacity = 1.0

          if (block.blockType === BlockType.Dirt) color = 0x8b4513
          if (block.blockType === BlockType.Grass) color = 0x12cc2b
          if (block.blockType === BlockType.Stone) color = 0x888888

          const geometry = new THREE.BoxGeometry(1, 1, 1)

          const material = new THREE.MeshLambertMaterial({
            color,
            transparent,
            opacity,
          })

          const mesh = new THREE.Mesh(geometry, material)
          mesh.position.set(x, y, z)
          group.add(mesh)
        }
      }
    }

    this.add(group)
  }

  public generate() {
    this.fillTerrain()
    this.generateMeshes()
  }
}
