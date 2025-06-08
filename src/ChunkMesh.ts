import * as THREE from "three"
import { Chunk } from "./Chunk"
import { BlockType } from "./types/block"

export class ChunkMesh {
  public static fromChunk(chunk: Chunk): THREE.Group {
    const group = new THREE.Group()

    for (let x = 0; x < Chunk.SIZE; x++) {
      for (let y = 0; y < Chunk.SIZE; y++) {
        for (let z = 0; z < Chunk.SIZE; z++) {
          const block = chunk.getBlock(x, y, z)

          if (block.type === BlockType.Air) continue

          let color = 0x00ff00
          let transparent = false
          let opacity = 1.0

          if (block.type === BlockType.Dirt) color = 0x8b4513
          if (block.type === BlockType.Grass) color = 0xff0000
          if (block.type === BlockType.Stone) color = 0x888888

          const geometry = new THREE.BoxGeometry(1, 1, 1)
          const material = new THREE.MeshLambertMaterial({ color, transparent, opacity })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.position.set(x, y, z)

          const edges = new THREE.EdgesGeometry(geometry)
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x505050, linewidth: 2 })
          )

          // Position the edges to match the mesh
          line.position.copy(mesh.position)

          group.add(mesh)
          group.add(line)
        }
      }
    }

    return group
  }
}
