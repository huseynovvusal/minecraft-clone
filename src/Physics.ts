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

    //TODO: Iterate through all blocks within the player's bounding box and check for potential collisions

    return collisionCandidates;
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
}

export default Physics;
