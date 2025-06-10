import { BlockType } from "@/types/block"

export class Block {
  static SIZE = 1

  constructor(public readonly blockType: BlockType, public readonly isSolid: boolean = true) {}
}

export class AirBlock extends Block {
  constructor() {
    super(BlockType.Air, false)
  }
}

export class DirtBlock extends Block {
  constructor() {
    super(BlockType.Dirt)
  }
}

export class GrassBlock extends Block {
  constructor() {
    super(BlockType.Grass)
  }
}

export class StoneBlock extends Block {
  constructor() {
    super(BlockType.Stone)
  }
}
