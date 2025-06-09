import * as THREE from "three"

import { BlockType } from "./types/block"

export class Block extends THREE.Mesh {
  static SIZE = 1

  constructor(
    public readonly instaceId: number,
    public readonly blockType: BlockType,
    public readonly isSolid: boolean = true
  ) {
    super()
  }
}

export class GrassBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Grass)

    this.material = new THREE.MeshLambertMaterial({ color: 0x12cc2b })
    this.geometry = new THREE.BoxGeometry(Block.SIZE, Block.SIZE, Block.SIZE)
    this.castShadow = true
    this.receiveShadow = true
  }
}

export class DirtBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Dirt)

    this.material = new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    this.geometry = new THREE.BoxGeometry(Block.SIZE, Block.SIZE, Block.SIZE)
    this.castShadow = true
    this.receiveShadow = true
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
