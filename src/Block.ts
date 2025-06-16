import * as THREE from 'three';
import { BlockType, type IBlock } from '@/types/block';

type TBlockScale = {
  x: number;
  y: number;
  z: number;
};

/**
 * Block class represents a single block in the game world.
 * It contains properties such as block type, solidity, scale, and scarcity.
 * It also provides methods to create specific types of blocks like Air, Dirt, Grass, etc.
 */
export class Block implements IBlock {
  static SIZE = 1;

  public readonly blockType: BlockType;
  public readonly position: THREE.Vector3;
  public readonly isSolid: boolean;
  public readonly scale: TBlockScale;
  public readonly scarcity: number;

  constructor(
    blockType: BlockType,
    position: THREE.Vector3,
    isSolid: boolean = true,
    scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
    scarcity: number = 0
  ) {
    this.blockType = blockType;
    this.position = position;
    this.isSolid = isSolid;
    this.scale = scale;
    this.scarcity = scarcity;
  }
}

export class AirBlock extends Block {
  constructor(position: THREE.Vector3) {
    super(BlockType.Air, position, false);
  }
}

export class DirtBlock extends Block {
  constructor(position: THREE.Vector3) {
    super(BlockType.Dirt, position);
  }
}

export class GrassBlock extends Block {
  constructor(position: THREE.Vector3) {
    super(BlockType.Grass, position);
  }
}

export class StoneBlock extends Block {
  constructor(position: THREE.Vector3) {
    super(BlockType.Stone, position, true, { x: 0.06, y: 0.075, z: 0.05 }, 0.1);
  }
}

export class CoalOreBlock extends Block {
  constructor(position: THREE.Vector3) {
    super(BlockType.CoalOre, position, true, { x: 0.15, y: 0.2, z: 0.15 }, 0.75);
  }
}

export class IronOreBlock extends Block {
  constructor(position: THREE.Vector3) {
    super(BlockType.IronOre, position, true, { x: 0.2, y: 0.2, z: 0.2 }, 0.8);
  }
}
