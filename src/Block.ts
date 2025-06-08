import { BlockType } from "./types/block"

export class Block {
  static SIZE = 1

  constructor(readonly id: number, readonly type: BlockType, public isSolid: boolean = true) {}
}

export class GrassBlock extends Block {
  constructor(id: number) {
    super(id, BlockType.Grass)
  }
}

export class DirtBlock extends Block {
  constructor(id: number) {
    super(id, BlockType.Dirt)
  }
}

export class StoneBlock extends Block {
  constructor(id: number) {
    super(id, BlockType.Stone)
  }
}

export class AirBlock extends Block {
  constructor() {
    super(0, BlockType.Air, false)
  }
}
