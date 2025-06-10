import * as THREE from "three"

import { AirBlock, Block } from "@/Block"
import { Terrain } from "@/Terrain"
import { BlockType } from "@/types/block"

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

    this.generate()
  }

  private initializeBlocks() {
    for (let x = 0; x < Chunk.SIZE; x++) {
      this.blocks[x] = []
      for (let y = 0; y < Chunk.SIZE; y++) {
        this.blocks[x][y] = []
        for (let z = 0; z < Chunk.SIZE; z++) {
          this.blocks[x][y][z] = new AirBlock(this, new THREE.Vector3(x, y, z))
        }
      }
    }
  }

  public getBlock(x: number, y: number, z: number): Block {
    if (x < 0 || x >= Chunk.SIZE || y < 0 || y >= Chunk.SIZE || z < 0 || z >= Chunk.SIZE) {
      // throw new Error("Block coordinates out of bounds")
      console.warn(`Block coordinates out of bounds: (${x}, ${y}, ${z})`)
      return new AirBlock(this, new THREE.Vector3(x, y, z)) // Return an AirBlock at the correct position
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
      [0, 1, 0], // top (y+)
      [0, -1, 0], // bottom (y-)
      [0, 0, 1], // front (z+)
      [0, 0, -1], // back (z-)
    ]

    for (const [dx, dy, dz] of directions) {
      const nx = x + dx
      const ny = y + dy
      const nz = z + dz

      if (this.getBlock(nx, ny, nz).blockType === BlockType.Air) {
        return true
      }
    }

    return false
  }

  private generateMeshes(): void {
    this.clear() // Clear previous meshes if any

    const blockTypeToPositions: Record<BlockType, THREE.Vector3[]> = {
      [BlockType.Grass]: [],
      [BlockType.Dirt]: [],
      [BlockType.Stone]: [],
      [BlockType.Air]: [],
    }

    // Initialize positions for each block type
    for (let x = 0; x < Chunk.SIZE; x++) {
      for (let y = 0; y < Chunk.SIZE; y++) {
        for (let z = 0; z < Chunk.SIZE; z++) {
          if (!this.isBlockVisible(x, y, z)) continue

          const block = this.getBlock(x, y, z)

          if (block.blockType === BlockType.Air) continue

          blockTypeToPositions[block.blockType].push(new THREE.Vector3(x, y, z))
        }
      }
    }

    for (const blockType in blockTypeToPositions) {
      const positions = blockTypeToPositions[blockType as unknown as BlockType]

      if (positions.length > 0) {
        const { x, y, z } = positions[0]
        const block = this.getBlock(x, y, z)

        const { geometry, material } = block.getGeometryAndMaterial()

        const instancedMesh = new THREE.InstancedMesh(geometry, material, positions.length)

        positions.forEach((position, index) => {
          const matrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z)
          instancedMesh.setMatrixAt(index, matrix)
        })

        instancedMesh.instanceMatrix.needsUpdate = true

        this.add(instancedMesh)
      }
    }
  }

  public generate() {
    this.initializeBlocks()
    this.fillTerrain()
    this.generateMeshes()
  }
}
