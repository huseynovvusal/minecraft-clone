import * as THREE from 'three';
import type { Chunk } from './world/Chunk';
import { Block } from './Block';
import type { Player } from './Player';

interface IBoundingBox {
  x: { min: number; max: number };
  y: { min: number; max: number };
  z: { min: number; max: number };
}

interface IPlayerBoundingBox extends IBoundingBox {
  center: THREE.Vector3;
}

// type CollisionCandidate = {
//   block: Block;
//   boundingBox: IPlayerBoundingBox;
// };

interface ICollisionCandidate {
  block: Block;
  boundingBox: IBoundingBox;
}

interface IPeneration {
  x: number;
  y: number;
  z: number;
}

class Physics {
  private static readonly COLLISION_EPSILON: number = 0.1;
  private static readonly PLAYER_COLLISION_PADDING: number = 0.2;

  public checkBlockCollision(chunk: Chunk, player: Player, position: THREE.Vector3) {
    const centerPosition = new THREE.Vector3(
      position.x,
      position.y + player.height / 2,
      position.z
    );

    const playerWidth = player.width - Physics.PLAYER_COLLISION_PADDING;
    const playerHeight = player.height - Physics.PLAYER_COLLISION_PADDING;

    const playerBox = this.createPlayerBoundingBox(centerPosition, playerWidth, playerHeight);

    const collisionCandidates = this.broadPhaseCollisionCheck(playerBox, chunk);

    const collisions = this.narrowPhaseCollisionCheck(playerBox, collisionCandidates);

    if (collisions.length > 0) {
      this.resolveCollisions(position, playerBox, collisions);
    }

    return position;
  }

  private createPlayerBoundingBox(
    center: THREE.Vector3,
    width: number,
    height: number
  ): IPlayerBoundingBox {
    return {
      x: {
        min: center.x - width / 2,
        max: center.x + width / 2,
      },
      y: {
        min: center.y,
        max: center.y + height,
      },
      z: {
        min: center.z - width / 2,
        max: center.z + width / 2,
      },
      center: center.clone(),
    };
  }

  private broadPhaseCollisionCheck(
    playerBox: IPlayerBoundingBox,
    chunk: Chunk
  ): ICollisionCandidate[] {
    const collisionCandidates: ICollisionCandidate[] = [];

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

  private narrowPhaseCollisionCheck(
    playerBox: IPlayerBoundingBox,
    candidates: ICollisionCandidate[]
  ) {
    const collisions: ICollisionCandidate[] = [];

    for (const candidate of candidates) {
      if (this.checkBoxIntersection(playerBox, candidate.boundingBox)) {
        collisions.push(candidate);
      }
    }

    return collisions;
  }

  private resolveCollisions(
    position: THREE.Vector3,
    playerBox: IPlayerBoundingBox,
    collisions: ICollisionCandidate[]
  ) {
    collisions.sort((a, b) => {
      const distanceA = this.distanceBetweenCenters(playerBox.center, a.boundingBox);
      const distanceB = this.distanceBetweenCenters(playerBox.center, b.boundingBox);

      return distanceA - distanceB;
    });

    for (const collision of collisions) {
      const penetration = this.calculatePenetration(playerBox, collision.boundingBox);

      const minPenetrationAxis = this.getMinPenetrationAxis(penetration);

      this.applyCollisionResolution(position, playerBox, collision.boundingBox, minPenetrationAxis);

      playerBox.x.min = position.x - (playerBox.x.max - playerBox.x.min) / 2;
      playerBox.x.max = position.x + (playerBox.x.max - playerBox.x.min) / 2;
      playerBox.y.min = position.y;
      playerBox.y.max = position.y + (playerBox.y.max - playerBox.y.min);
      playerBox.z.min = position.z - (playerBox.z.max - playerBox.z.min) / 2;
      playerBox.z.max = position.z + (playerBox.z.max - playerBox.z.min) / 2;
    }
  }

  private checkBoxIntersection(boxA: IBoundingBox, boxB: IBoundingBox): boolean {
    return (
      boxA.x.max > boxB.x.min &&
      boxA.x.min < boxB.x.max &&
      boxA.y.max > boxB.y.min &&
      boxA.y.min < boxB.y.max &&
      boxA.z.max > boxB.z.min &&
      boxA.z.min < boxB.z.max
    );
  }

  private distanceBetweenCenters(center: THREE.Vector3, box: IBoundingBox): number {
    const boxCenterX = (box.x.min + box.x.max) / 2;
    const boxCenterY = (box.y.min + box.y.max) / 2;
    const boxCenterZ = (box.z.min + box.z.max) / 2;

    return Math.sqrt(
      Math.pow(center.x - boxCenterX, 2) +
        Math.pow(center.y - boxCenterY, 2) +
        Math.pow(center.z - boxCenterZ, 2)
    );
  }

  private calculatePenetration(playerBox: IPlayerBoundingBox, blockBox: IBoundingBox): IPeneration {
    return {
      x: Math.min(playerBox.x.max - blockBox.x.min, blockBox.x.max - playerBox.x.min),
      y: Math.min(playerBox.y.max - blockBox.y.min, blockBox.y.max - playerBox.y.min),
      z: Math.min(playerBox.z.max - blockBox.z.min, blockBox.z.max - playerBox.z.min),
    };
  }

  private getMinPenetrationAxis(penetration: IPeneration): 'x' | 'y' | 'z' {
    if (penetration.x < penetration.y && penetration.x < penetration.z) {
      return 'x';
    } else if (penetration.y <= penetration.x && penetration.y < penetration.z) {
      return 'y';
    } else {
      return 'z';
    }
  }

  private applyCollisionResolution(
    position: THREE.Vector3,
    playerBox: IPlayerBoundingBox,
    blockBox: IBoundingBox,
    axis: 'x' | 'y' | 'z'
  ): void {
    switch (axis) {
      case 'x':
        if (playerBox.center.x < (blockBox.x.min + blockBox.x.max) / 2) {
          position.x =
            blockBox.x.min - (playerBox.x.max - playerBox.center.x) - Physics.COLLISION_EPSILON;
        } else {
          position.x =
            blockBox.x.max + (playerBox.center.x - playerBox.x.min) + Physics.COLLISION_EPSILON;
        }
        break;
      case 'y':
        if (playerBox.center.y < (blockBox.y.min + blockBox.y.max) / 2) {
          position.y =
            blockBox.y.min - (playerBox.y.max - playerBox.center.y) - Physics.COLLISION_EPSILON;
        } else {
          position.y = blockBox.y.max + Physics.COLLISION_EPSILON;
        }
        break;
      case 'z':
        if (playerBox.center.z < (blockBox.z.min + blockBox.z.max) / 2) {
          position.z =
            blockBox.z.min - (playerBox.z.max - playerBox.center.z) - Physics.COLLISION_EPSILON;
        } else {
          position.z =
            blockBox.z.max + (playerBox.center.z - playerBox.z.min) + Physics.COLLISION_EPSILON;
        }
        break;
    }
  }
}

export default Physics;
