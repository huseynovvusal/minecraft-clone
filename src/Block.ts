import * as THREE from "three"

import { BlockType } from "@/types/block"
import type { Chunk } from "./Chunk"

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
    //TODO: Remove chunk dependency if not needed
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

    this.geometry = new THREE.BoxGeometry(Block.SIZE, Block.SIZE, Block.SIZE)
    this.material = faces.map(
      (texture) =>
        new THREE.MeshLambertMaterial({
          map: texture,
        })
    )
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

  public getGeometryAndMaterial(): {
    geometry: THREE.BufferGeometry
    material: THREE.Material | THREE.Material[]
  } {
    if (!this.geometry || !this.material) {
      throw new Error("Geometry or material not initialized")
    }

    return {
      geometry: this.geometry,
      material: this.material,
    }
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
