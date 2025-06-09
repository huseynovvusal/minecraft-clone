import * as THREE from "three"

import { BlockType } from "@/types/block"
import type { Chunk } from "./Chunk"

//! Debug
const counter = (): [() => number, () => void] => {
  let count = 0

  return [
    () => count,
    () => {
      count++
      console.log(`Face count: ${count}`)
    },
  ]
}

const [faceCount, incrementFaceCount] = counter()
const [blockCount, incrementBlockCount] = counter()

interface ITexture {
  top: string
  bottom: string
  left: string
  right: string
  front: string
  back: string
}

type TBlockFace = "top" | "bottom" | "left" | "right" | "front" | "back"

type TBlockTextures = {
  [face in TBlockFace]: string
}

type TBlockTextureMap = {
  [key in BlockType]: TBlockTextures | undefined
}

const TEXTURE_MAP: TBlockTextureMap = {
  [BlockType.Air]: undefined,
  [BlockType.Dirt]: {
    top: "/textures/blocks/dirt.png",
    bottom: "/textures/blocks/dirt.png",
    left: "/textures/blocks/dirt.png",
    right: "/textures/blocks/dirt.png",
    front: "/textures/blocks/dirt.png",
    back: "/textures/blocks/dirt.png",
  },
  [BlockType.Grass]: {
    top: "/textures/blocks/grass_top.png",
    bottom: "/textures/blocks/dirt.png",
    left: "/textures/blocks/grass.png",
    right: "/textures/blocks/grass.png",
    front: "/textures/blocks/grass.png",
    back: "/textures/blocks/grass.png",
  },
  [BlockType.Stone]: {
    top: "/textures/blocks/stone.png",
    bottom: "/textures/blocks/stone.png",
    left: "/textures/blocks/stone.png",
    right: "/textures/blocks/stone.png",
    front: "/textures/blocks/stone.png",
    back: "/textures/blocks/stone.png",
  },
}

export class Block extends THREE.Mesh {
  static SIZE = 1
  private textureLoader = new THREE.TextureLoader()

  constructor(
    private readonly chunk: Chunk,
    public readonly instaceId: number,
    public readonly blockType: BlockType,
    public readonly isSolid: boolean = true,
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) {
    super()
    this.position.copy(position)
  }

  protected load(texturePaths: ITexture | undefined): void {
    if (!texturePaths) {
      console.warn(`No textures defined for block type: ${this.blockType}`)
      return
    }

    const textures = {
      top: this.loadTexture(texturePaths.top),
      bottom: this.loadTexture(texturePaths.bottom),
      left: this.loadTexture(texturePaths.left),
      right: this.loadTexture(texturePaths.right),
      front: this.loadTexture(texturePaths.front),
      back: this.loadTexture(texturePaths.back),
    }

    const faces = [
      textures.right,
      textures.left,
      textures.top,
      textures.bottom,
      textures.front,
      textures.back,
    ]

    // Ensure position is set before calculating face visibility
    const faceVisibility = this.getFaceVisiblity()

    //! Debug
    // console.log(
    //   `Block ${this.blockType} at ${this.position.toArray()} has visibility: ${faceVisibility}`
    // )
    // for (let isVisible of faceVisibility) {
    //   if (isVisible) {
    //     incrementFaceCount()
    //   }
    // }
    // incrementBlockCount()

    // Create a material for each face, using a fallback material for hidden faces
    // const fallbackMaterial = new THREE.MeshLambertMaterial({ visible: false })
    const fallbackMaterial = null
    const materials = faces.map((texture, index) =>
      faceVisibility[index]
        ? new THREE.MeshLambertMaterial({
            map: texture,
          })
        : fallbackMaterial
    )

    this.geometry = new THREE.BoxGeometry(Block.SIZE, Block.SIZE, Block.SIZE)
    this.material = materials
    this.castShadow = true
    this.receiveShadow = true
  }

  private loadTexture(path: string) {
    const tex = this.textureLoader.load(path)
    tex.magFilter = THREE.NearestFilter
    tex.minFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    return tex
  }

  private getFaceVisiblity(): boolean[] {
    const visibility = [true, true, true, true, true, true] // right, left, top, bottom, front, back

    // Check neighbors in all directions
    const directions = [
      [Block.SIZE, 0, 0], // right (x+)
      [-Block.SIZE, 0, 0], // left (x-)
      [0, Block.SIZE, 0], // up (y+)
      [0, -Block.SIZE, 0], // down (y-)
      [0, 0, Block.SIZE], // front (z+)
      [0, 0, -Block.SIZE], // back (z-)
    ]

    for (let i = 0; i < directions.length; i++) {
      const [dx, dy, dz] = directions[i]

      const neighbor = this.chunk.getBlock(
        this.position.x + dx,
        this.position.y + dy,
        this.position.z + dz
      )

      if (neighbor.blockType !== BlockType.Air) {
        visibility[i] = false
      }
    }

    return visibility
  }
}

export class GrassBlock extends Block {
  constructor(chunk: Chunk, instaceId: number, position: THREE.Vector3) {
    super(chunk, instaceId, BlockType.Grass, true, position)

    this.load(TEXTURE_MAP[BlockType.Grass])
  }
}
export class DirtBlock extends Block {
  constructor(chunk: Chunk, instaceId: number, position: THREE.Vector3) {
    super(chunk, instaceId, BlockType.Dirt, true, position)

    this.load(TEXTURE_MAP[BlockType.Dirt])
  }
}

export class StoneBlock extends Block {
  constructor(chunk: Chunk, instaceId: number, position: THREE.Vector3) {
    super(chunk, instaceId, BlockType.Stone, true, position)

    this.load(TEXTURE_MAP[BlockType.Stone])
  }
}

export class AirBlock extends Block {
  constructor(chunk: Chunk, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
    super(chunk, 0, BlockType.Air, false, position)
  }
}
