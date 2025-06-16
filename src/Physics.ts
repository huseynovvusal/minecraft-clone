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

interface ICollisionDetail {
  block: Block;
  penetration: THREE.Vector3;
  normal: THREE.Vector3;
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

    const collisionDetails = this.narrowPhaseCollisionCheck(playerBoundingBox, collisionCandidates);

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
        min: position.x - radius,
        max: position.x + radius,
      },
      y: {
        min: position.y - height / 2,
        max: position.y + height / 2,
      },
      z: {
        min: position.z - radius,
        max: position.z + radius,
      },
      position: position.clone(),
    };
  }

  private broadPhaseCollisionCheck(
    playerBox: IPlayerBoundingBox,
    chunk: Chunk
  ): ICollisionCandidate[] {
    const collisionCandidates: ICollisionCandidate[] = [];

    const minX = Math.floor(playerBox.x.min);
    const maxX = Math.ceil(playerBox.x.max);
    const minY = Math.floor(playerBox.y.min);
    const maxY = Math.ceil(playerBox.y.max);
    const minZ = Math.floor(playerBox.z.min);
    const maxZ = Math.ceil(playerBox.z.max);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
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

    //! Debug
    console.log('Broad Phase Collision Candidates:', collisionCandidates.length);

    return collisionCandidates;
  }

  private narrowPhaseCollisionCheck(
    playerBox: IPlayerBoundingBox,
    candidates: ICollisionCandidate[]
  ): ICollisionDetail[] {
    const collisions: ICollisionDetail[] = [];

    for (const candidate of candidates) {
      if (this.checkAABBIntersection(playerBox, candidate.boundingBox)) {
        const penetration = this.calculatePenetration(playerBox, candidate.boundingBox);

        const normal = this.calculateCollisionNormal(penetration);

        collisions.push({
          block: candidate.block,
          penetration: penetration,
          normal: normal,
        });
      }
    }

    //! Debug
    console.log(
      'Narrow Phase Collisions:',
      collisions.length
      // collisions.map(c => c.block.position),
      // collisions.map(c => c.penetration),
      // collisions.map(c => c.normal),
      // playerBox
    );

    return collisions;
  }

  private checkAABBIntersection(boxA: IBoundingBox, boxB: IBoundingBox): boolean {
    return (
      boxA.x.min <= boxB.x.max &&
      boxA.x.max >= boxB.x.min &&
      boxA.y.min <= boxB.y.max &&
      boxA.y.max >= boxB.y.min &&
      boxA.z.min <= boxB.z.max &&
      boxA.z.max >= boxB.z.min
    );
  }

  private calculatePenetration(
    playerBox: IPlayerBoundingBox,
    blockBox: IBoundingBox
  ): THREE.Vector3 {
    const xOverlap = Math.min(playerBox.x.max - blockBox.x.min, blockBox.x.max - playerBox.x.min);

    const yOverlap = Math.min(playerBox.y.max - blockBox.y.min, blockBox.y.max - playerBox.y.min);

    const zOverlap = Math.min(playerBox.z.max - blockBox.z.min, blockBox.z.max - playerBox.z.min);

    return new THREE.Vector3(xOverlap, yOverlap, zOverlap);
  }

  private calculateCollisionNormal(penetration: THREE.Vector3): THREE.Vector3 {
    const normal = new THREE.Vector3();

    // Find the axis with the smallest penetration
    if (penetration.x <= penetration.y && penetration.x <= penetration.z) {
      // X-axis has smallest penetration
      normal.x = 1;
    } else if (penetration.y <= penetration.x && penetration.y <= penetration.z) {
      // Y-axis has smallest penetration
      normal.y = 1;
    } else {
      // Z-axis has smallest penetration
      normal.z = 1;
    }

    return normal;
  }
}

export default Physics;
