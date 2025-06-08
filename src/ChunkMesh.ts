import * as THREE from "three"
import { Chunk } from "./Chunk"
import { BlockType } from "./types/block"

export class ChunkMesh {
  public static fromChunk(chunk: Chunk): THREE.Group {
    const group = new THREE.Group()

    // Create geometry for each block type to batch similar blocks
    const geometries: Map<
      BlockType,
      {
        positions: number[]
        indices: number[]
        edgePositions: number[]
        edgeIndices: number[]
      }
    > = new Map()

    // Initialize geometries for each block type
    for (const type of Object.values(BlockType)) {
      if (typeof type === "number" && type !== BlockType.Air) {
        geometries.set(type, {
          positions: [],
          indices: [],
          edgePositions: [],
          edgeIndices: [],
        })
      }
    }

    // Directions to check for neighbors: [x, y, z]
    const directions = [
      [1, 0, 0],
      [-1, 0, 0], // right, left
      [0, 1, 0],
      [0, -1, 0], // up, down
      [0, 0, 1],
      [0, 0, -1], // front, back
    ]

    // Vertices for each face of a cube
    const faceVertices = [
      // Right face (x+)
      [1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      // Left face (x-)
      [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0],
      // Top face (y+)
      [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
      // Bottom face (y-)
      [0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
      // Front face (z+)
      [0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      // Back face (z-)
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    ]

    // Helper function to check if a block position is valid and not air
    const isBlockSolid = (x: number, y: number, z: number): boolean => {
      if (x < 0 || x >= Chunk.SIZE || y < 0 || y >= Chunk.SIZE || z < 0 || z >= Chunk.SIZE) {
        return false // Consider out of bounds as "not solid" for rendering purposes
      }
      return chunk.getBlock(x, y, z).isSolid
    }

    for (let x = 0; x < Chunk.SIZE; x++) {
      for (let y = 0; y < Chunk.SIZE; y++) {
        for (let z = 0; z < Chunk.SIZE; z++) {
          const block = chunk.getBlock(x, y, z)

          if (block.type === BlockType.Air) continue

          const blockGeometryData = geometries.get(block.type)
          if (!blockGeometryData) continue

          // Check each face of the current block
          for (let i = 0; i < 6; i++) {
            const [dx, dy, dz] = directions[i]
            const nx = x + dx,
              ny = y + dy,
              nz = z + dz

            // Only render face if neighbor block is air or out of bounds
            if (!isBlockSolid(nx, ny, nz)) {
              // Get current indices count to reference the new vertices correctly
              const vertexOffset = blockGeometryData.positions.length / 3

              // Add vertices for this face
              for (let v = 0; v < 12; v += 3) {
                blockGeometryData.positions.push(
                  faceVertices[i][v] + x,
                  faceVertices[i][v + 1] + y,
                  faceVertices[i][v + 2] + z
                )
              }

              // Add indices for two triangles making up this face
              blockGeometryData.indices.push(
                vertexOffset,
                vertexOffset + 1,
                vertexOffset + 2,
                vertexOffset,
                vertexOffset + 2,
                vertexOffset + 3
              )

              // Add edges for this face (square outline)
              blockGeometryData.edgePositions.push(
                // First vertex
                faceVertices[i][0] + x,
                faceVertices[i][1] + y,
                faceVertices[i][2] + z,
                // Second vertex
                faceVertices[i][3] + x,
                faceVertices[i][4] + y,
                faceVertices[i][5] + z,
                // Third vertex
                faceVertices[i][6] + x,
                faceVertices[i][7] + y,
                faceVertices[i][8] + z,
                // Fourth vertex
                faceVertices[i][9] + x,
                faceVertices[i][10] + y,
                faceVertices[i][11] + z
              )

              // Edge indices - connect the 4 vertices in a loop
              const edgeOffset = blockGeometryData.edgePositions.length / 3 - 4
              blockGeometryData.edgeIndices.push(
                edgeOffset,
                edgeOffset + 1,
                edgeOffset + 1,
                edgeOffset + 2,
                edgeOffset + 2,
                edgeOffset + 3,
                edgeOffset + 3,
                edgeOffset
              )
            }
          }
        }
      }
    }

    // Create meshes for each block type
    for (const [type, geometryData] of geometries.entries()) {
      if (geometryData.positions.length === 0) continue // Skip if no blocks of this type

      let color = 0x00ff00
      let transparent = false
      let opacity = 1.0

      if (type === BlockType.Dirt) color = 0x8b4513
      if (type === BlockType.Grass) color = 0x12cc2b
      if (type === BlockType.Stone) color = 0x888888

      // Create block mesh
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(geometryData.positions, 3))
      geometry.setIndex(geometryData.indices)

      const material = new THREE.MeshLambertMaterial({ color, transparent, opacity })
      const mesh = new THREE.Mesh(geometry, material)
      group.add(mesh)

      // Create edges mesh
      if (geometryData.edgePositions.length > 0) {
        const edgeGeometry = new THREE.BufferGeometry()
        edgeGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(geometryData.edgePositions, 3)
        )
        edgeGeometry.setIndex(geometryData.edgeIndices)

        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x505050, linewidth: 2 })
        const edgeMesh = new THREE.LineSegments(edgeGeometry, edgeMaterial)
        group.add(edgeMesh)
      }
    }

    return group
  }
}
