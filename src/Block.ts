import * as THREE from "three"

import { BlockType } from "./types/block"

export class Block extends THREE.Mesh {
  static SIZE = 1

  constructor(
    readonly instaceId: number,
    readonly blockType: BlockType,
    public isSolid: boolean = true
  ) {
    super()
  }
}

export class GrassBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Grass)
  }
}

export class DirtBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Dirt)
  }
}

export class StoneBlock extends Block {
  constructor(instaceId: number) {
    super(instaceId, BlockType.Stone)
  }
}

export class AirBlock extends Block {
  constructor() {
    super(0, BlockType.Air, false)
  }
}
