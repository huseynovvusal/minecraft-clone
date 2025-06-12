import * as THREE from "three"

import { Chunk } from "@/Chunk"
import { BlockType } from "@/types/block"
import TextureManager from "@/TextureManager"

class ChunkRenderer extends THREE.Group {
  private chunk: Chunk

  constructor(chunk: Chunk) {
    super()

    this.chunk = chunk
  }

  /**
   * Renders the chunk by creating instanced meshes for each block type.
   */
  render(): void {
    this.clear()

    const blockTypeToPositions: Record<BlockType, THREE.Vector3[]> = {
      [BlockType.Grass]: [],
      [BlockType.Dirt]: [],
      [BlockType.Stone]: [],
      [BlockType.Air]: [],
      [BlockType.CoalOre]: [],
      [BlockType.IronOre]: [],
    }

    //! Measure performance
    const start = performance.now()

    // Initialize positions for each block type
    for (let x = 0; x < this.chunk.size.width; x++) {
      for (let y = 0; y < this.chunk.size.height; y++) {
        for (let z = 0; z < this.chunk.size.width; z++) {
          const block = this.chunk.getBlock(x, y, z)

          if (!block || !this.chunk.isBlockVisible(x, y, z)) continue

          blockTypeToPositions[block.blockType].push(new THREE.Vector3(x, y, z))
        }
      }
    }

    for (const blockType in blockTypeToPositions) {
      const positions = blockTypeToPositions[blockType as unknown as BlockType]

      if (positions.length > 0) {
        const { x, y, z } = positions[0]
        const block = this.chunk.getBlock(x, y, z)

        if (!block) continue

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const textures = TextureManager.getInstance().getTextures(block.blockType)
        const material = textures.map(
          (texture) => new THREE.MeshLambertMaterial({ map: texture, side: THREE.FrontSide })
        )

        //? Add wireframe strokes for testing
        // this.addWireframeStrokes(geometry, positions)

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

  /**
   * Adds wireframe strokes to the chunk for debugging purposes.
   */
  private addWireframeStrokes(geometry: THREE.BufferGeometry, positions: THREE.Vector3[]): void {
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })

    const wireframeMesh = new THREE.InstancedMesh(geometry, wireframeMaterial, positions.length)

    positions.forEach((position, index) => {
      const matrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z)
      wireframeMesh.setMatrixAt(index, matrix)
    })

    wireframeMesh.instanceMatrix.needsUpdate = true
    this.add(wireframeMesh)
  }
}

export { ChunkRenderer }
