import * as THREE from "three"

import { Block } from "@/Block"
import { Terrain } from "@/Terrain"
import { BlockType } from "@/types/block"
import BlockStorage from "./BlockStorage"
import TextureManager from "./TextureManager"

export class Chunk extends THREE.Group {
  // private blocks: Block[][][] = []
  private blocks: BlockStorage = new BlockStorage()

  public size = {
    width: 64,
    height: 64,
  }

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
      console.warn(`Block coordinates out of bounds: (${x}, ${y}, ${z})`)

      return null
    }

    return this.blocks.getBlock(x, y, z) || null
    // return this.blocks[x][y][z]
  }

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

    if (!block || block.blockType === BlockType.Air) {
      return false
    }

    return true

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

  private generateMeshes(): void {
    this.clear() // Clear previous meshes if any

    const blockTypeToPositions: Record<BlockType, THREE.Vector3[]> = {
      [BlockType.Grass]: [],
      [BlockType.Dirt]: [],
      [BlockType.Stone]: [],
      [BlockType.Air]: [],
    }

    //! Measure performance
    const start = performance.now()

    // Initialize positions for each block type
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          const block = this.getBlock(x, y, z)

          if (!block || !this.isBlockVisible(x, y, z)) continue

          blockTypeToPositions[block.blockType].push(new THREE.Vector3(x, y, z))
        }
      }
    }

    for (const blockType in blockTypeToPositions) {
      const positions = blockTypeToPositions[blockType as unknown as BlockType]

      if (positions.length > 0) {
        const { x, y, z } = positions[0]
        const block = this.getBlock(x, y, z)

        if (!block) continue

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const textures = TextureManager.getInstance().getTextures(block.blockType)
        const material = textures.map((texture) => new THREE.MeshLambertMaterial({ map: texture }))

        const instancedMesh = new THREE.InstancedMesh(geometry, material, positions.length)

        instancedMesh.castShadow = true
        instancedMesh.receiveShadow = true

        positions.forEach((position, index) => {
          const matrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z)
          instancedMesh.setMatrixAt(index, matrix)
        })

        instancedMesh.instanceMatrix.needsUpdate = true

        this.add(instancedMesh)
      }
    }

    // !
    const end = performance.now()
    console.log(`Chunk generated in ${end - start} ms`)
  }

  public generate() {
    this.fillTerrain()
    this.generateMeshes()
  }
}
