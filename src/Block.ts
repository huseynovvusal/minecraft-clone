import { BlockType } from "./types/block"

class Block {
  static SIZE = 1

  constructor(private readonly id: number, private readonly type: BlockType) {}
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
    super(0, BlockType.Air)
  }
}
