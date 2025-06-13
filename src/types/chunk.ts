import * as THREE from 'three';

import type { Block } from '@/Block';

export interface IChunk {
  pos: THREE.Vector2;
  size: {
    width: number;
    height: number;
  };
  params: {
    seed: number;
    terrain: {
      scale: number;
      amplitude: number;
      offset: number;
    };
  };

  getBlock(x: number, y: number, z: number): Block | null;
  setBlock(x: number, y: number, z: number, block: Block): void;
  isBlockVisible(x: number, y: number, z: number): boolean;
  generate(): void;
  clear(): void;
}
