import * as THREE from 'three';
import type { Chunk } from './world/Chunk';
import { Block } from './Block';

type PlayerBoundingBox = {
  x: { min: number; max: number };
  y: { min: number; max: number };
  z: { min: number; max: number };
};

type CollisionCandidate = {
  block: Block;
  boundingBox: PlayerBoundingBox;
};

class Physics {
  private static readonly COLLISION_EPSILON: number = 0.001;
  private static readonly PLAYER_COLLISION_PADDING: number = 0.2;

  private createPlayerBoundingBox(
    position: THREE.Vector3,
    width: number,
    height: number
  ): PlayerBoundingBox & {
    position: THREE.Vector3;
  } {
    return {
      x: {
        min: position.x - width / 2,
        max: position.x + width / 2,
      },
      y: {
        min: position.y,
        max: position.y + height,
      },
      z: {
        min: position.z - width / 2,
        max: position.z + width / 2,
      },
      position: position.clone(),
    };
  }

  private broadPhaseCollisionCheck(playerBox: PlayerBoundingBox, chunk: Chunk) {
    const collisionCandidates: CollisionCandidate[] = [];

    const minBlockX = Math.floor(playerBox.x.min);
    const maxBlockX = Math.ceil(playerBox.x.max);
    const minBlockY = Math.floor(playerBox.y.min);
    const maxBlockY = Math.ceil(playerBox.y.max);
    const minBlockZ = Math.floor(playerBox.z.min);
    const maxBlockZ = Math.ceil(playerBox.z.max);

    for (let x = minBlockX; x <= maxBlockX; x++) {
      for (let y = minBlockY; y <= maxBlockY; y++) {
        for (let z = minBlockZ; z <= maxBlockZ; z++) {
          const block = chunk.getBlock(x, y, z);

          if (block && block.isSolid) {
            collisionCandidates.push({
              block,
              boundingBox: {
                x: { min: x, max: x + Block.SIZE },
                y: { min: y, max: y + Block.SIZE },
                z: { min: z, max: z + Block.SIZE },
              },
            });
          }
        }
      }
    }

    return collisionCandidates;
  }
}

export default Physics;
