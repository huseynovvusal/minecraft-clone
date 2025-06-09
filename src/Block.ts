import * as THREE from "three"

import { BlockType } from "@/types/block"

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
    public readonly instaceId: number,
    public readonly blockType: BlockType,
    public readonly isSolid: boolean = true
  ) {
    super()
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

    // Create a material for each face
    const materials = [
      new THREE.MeshLambertMaterial({
        map: textures.right,
        side: THREE.DoubleSide,
        transparent: true,
        flatShading: true,
      }), // right
      new THREE.MeshLambertMaterial({
        map: textures.left,
        side: THREE.DoubleSide,
        transparent: true,
        flatShading: true,
      }), // left
      new THREE.MeshLambertMaterial({
        map: textures.top,
        side: THREE.DoubleSide,
        transparent: true,
        flatShading: true,
      }), // top
      new THREE.MeshLambertMaterial({
        map: textures.bottom,
        side: THREE.DoubleSide,
        transparent: true,
        flatShading: true,
      }), // bottom
      new THREE.MeshLambertMaterial({
        map: textures.front,
        side: THREE.DoubleSide,
        transparent: true,
        flatShading: true,
      }), // front
      new THREE.MeshLambertMaterial({
        map: textures.back,
        side: THREE.DoubleSide,
        transparent: true,
        flatShading: true,
      }), // back
    ]

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
}

export class GrassBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Grass)

    this.load(TEXTURE_MAP[BlockType.Grass])
  }
}

export class DirtBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Dirt)

    this.load(TEXTURE_MAP[BlockType.Dirt])
  }
}

export class StoneBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Stone)

    this.material = new THREE.MeshLambertMaterial({ color: 0x888888 })
    this.geometry = new THREE.BoxGeometry(Block.SIZE, Block.SIZE, Block.SIZE)
    this.castShadow = true
    this.receiveShadow = true
  }
}

export class AirBlock extends Block {
  constructor() {
    super(0, BlockType.Air, false)
  }
}
