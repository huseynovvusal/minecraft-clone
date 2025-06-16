import * as THREE from 'three';
import type { Chunk } from './world/Chunk';
import { Block } from './Block';

interface IBoundingBox {
  x: { min: number; max: number };
  y: { min: number; max: number };
  z: { min: number; max: number };
}

interface IPlayerBoundingBox extends IBoundingBox {
  position: THREE.Vector3; //? This is the center of the player bounding box
}

interface ICollisionCandidate {
  block: Block;
  boundingBox: IBoundingBox;
}

class Physics {
  public checkCollision(
    playerPosition: THREE.Vector3,
    playerRadius: number,
    playerHeight: number,
    chunk: Chunk
  ): any {
    const playerBoundingBox = this.createPlayerBoundingBox(
      playerPosition,
      playerRadius,
      playerHeight
    );

    const collisionCandidates = this.broadPhaseCollisionCheck(playerBoundingBox, chunk);

    return collisionCandidates;
  }

  /**
   * Creates a bounding box for the player based on their position, radius, and height.
   */
  private createPlayerBoundingBox(
    position: THREE.Vector3,
    radius: number,
    height: number
  ): IPlayerBoundingBox {
    return {
      x: {
        min: Math.floor(position.x - radius),
        max: Math.ceil(position.x + radius),
      },
      y: {
        min: Math.floor(position.y - height / 2),
        max: Math.ceil(position.y + height / 2),
      },
      z: {
        min: Math.floor(position.z - radius),
        max: Math.ceil(position.z + radius),
      },
      position: position.clone(),
    };
  }

  private broadPhaseCollisionCheck(
    playerBox: IPlayerBoundingBox,
    chunk: Chunk
  ): ICollisionCandidate[] {
    const collisionCandidates: ICollisionCandidate[] = [];

    for (let x = playerBox.x.min; x <= playerBox.x.max; x++) {
      for (let y = playerBox.y.min; y <= playerBox.y.max; y++) {
        for (let z = playerBox.z.min; z <= playerBox.z.max; z++) {
          const block = chunk.getBlock(x, y, z);

          if (!block || !block.isSolid) continue;

          collisionCandidates.push({
            block: block,
            boundingBox: {
              x: { min: x, max: x + 1 },
              y: { min: y, max: y + 1 },
              z: { min: z, max: z + 1 },
            },
          });
        }
      }
    }

    console.log('Broad Phase Collision Candidates:', collisionCandidates.length);

    return collisionCandidates;
  }
}

export default Physics;
