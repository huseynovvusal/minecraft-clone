import { BlockType, type IBlock } from "@/types/block"

export class Block implements IBlock {
  static SIZE = 1

  constructor(
    public readonly blockType: BlockType,
    public readonly isSolid: boolean = true,
    public readonly scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
    public readonly scarcity: number = 0
  ) {}
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
    super(BlockType.Stone, true, { x: 0.06, y: 0.075, z: 0.05 }, 0.1)
  }
}

export class CoalOreBlock extends Block {
  constructor() {
    super(BlockType.CoalOre, true, { x: 0.1, y: 0.1, z: 0.1 }, 0.2)
  }
}

export class IronOreBlock extends Block {
  constructor() {
    super(BlockType.IronOre, true, { x: 0.2, y: 0.2, z: 0.2 }, 0.55)
  }
}
