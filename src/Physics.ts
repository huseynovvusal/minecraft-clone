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
  ) {
    const playerBoundingBox = this.createPlayerBoundingBox(
      playerPosition,
      playerRadius,
      playerHeight
    );

    const collisionCandidates = this.broadPhaseCollisionCheck(playerBoundingBox, chunk);

    const collisionDetails = this.narrowPhaseCollisionCheck(playerBoundingBox, collisionCandidates);

    return {
      collisions: collisionDetails,
      hasCollision: collisionDetails.length > 0,
      //! Testing
      collisionCandidates,
    };
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
              x: { min: x - 0.5, max: x + 0.5 },
              y: { min: y - 0.5, max: y + 0.5 },
              z: { min: z - 0.5, max: z + 0.5 },
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
    // if (penetration.x <= penetration.y && penetration.x <= penetration.z) {
    //   // X-axis has smallest penetration
    //   normal.x = 1;
    // }
    if (penetration.y <= penetration.x && penetration.y <= penetration.z) {
      // Y-axis has smallest penetration
      normal.y = 1;
    }
    //  else if (penetration.z <= penetration.x && penetration.z <= penetration.y) {
    //   // Z-axis has smallest penetration
    //   normal.z = 1;
    // }

    return normal;
  }

  public resolveCollisions(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    collisions: ICollisionDetail[]
  ) {
    const newPosition = position.clone();
    const newVelocity = velocity.clone();
    let isOnGround = false;

    for (const collision of collisions) {
      const correction = new THREE.Vector3();

      if (collision.normal.x !== 0) {
        const direction = Math.sign(newVelocity.x);
        correction.x = collision.penetration.x * (direction || 1);
        newVelocity.x = 0;
      }

      if (collision.normal.y !== 0) {
        const playerCenterY = position.y;
        const blockCenterY = collision.block.position.y;

        const direction = playerCenterY > blockCenterY ? 1 : -1;

        correction.y = collision.penetration.y * direction;

        if (newVelocity.y < 0 && collision.normal.y > 0) {
          isOnGround = true;
        }

        newVelocity.y = 0;
      }

      if (collision.normal.z !== 0) {
        const direction = Math.sign(newVelocity.z);
        correction.z = collision.penetration.z * (direction || 1);
        newVelocity.z = 0;
      }

      newPosition.add(correction);
    }

    return {
      position: newPosition,
      velocity: newVelocity,
      isOnGround: isOnGround,
    };
  }
}

export default Physics;
