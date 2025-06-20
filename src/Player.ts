import * as THREE from 'three';
import Physics from './Physics';
import type { Chunk } from './world/Chunk';

export class Player {
  // Player properties
  public position: THREE.Vector3;
  private velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private direction: THREE.Vector3 = new THREE.Vector3();
  private mass: number = 2.5; // Mass for physics calculations, if needed

  // public readonly height: number = 1.75; // Player height for collision detection
  public readonly height: number = 2; // Player height for collision detection
  public readonly radius: number = 0.5; // Player radius for collision detection

  // Movement state
  private isMovingForward: boolean = false;
  private isMovingBackward: boolean = false;
  private isMovingLeft: boolean = false;
  private isMovingRight: boolean = false;
  private isMovingUp: boolean = false;
  private isMovingDown: boolean = false;

  // Movement settings
  private readonly speed: number = 30;
  private readonly jumpHeight: number = 8;
  private readonly gravity: number = 9.81;

  // Physics flags
  public canJump: boolean = true;
  private isFlying: boolean = false;

  // Physics
  private readonly physics = new Physics();

  constructor() {
    // Initial position is at the player's feet
    const initialPosition = new THREE.Vector3(10, 25, 10);
    this.position = initialPosition.clone();

    this.setupKeyboardControls();
  }

  public respawn(): void {
    this.position.set(25, 50, 25);
  }

  private setupKeyboardControls(): void {
    document.addEventListener('keydown', event => {
      this.onKeyDown(event);
    });
    document.addEventListener('keyup', event => {
      this.onKeyUp(event);
    });
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
        this.isMovingForward = true;
        break;
      case 'KeyS':
        this.isMovingBackward = true;
        break;
      case 'KeyA':
        this.isMovingLeft = true;
        break;
      case 'KeyD':
        this.isMovingRight = true;
        break;
      case 'Space':
        if (this.isFlying) {
          this.isMovingUp = true;
        } else if (this.canJump) {
          this.velocity.y = this.jumpHeight;
          this.canJump = false;
        }
        break;
      case 'ShiftLeft':
        if (this.isFlying) {
          this.isMovingDown = true;
        }
        break;
      case 'KeyF':
        //? Toggle flying mode
        this.isFlying = !this.isFlying;

        if (this.isFlying) {
          this.velocity.y = 0;
        }
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
        this.isMovingForward = false;
        break;
      case 'KeyS':
        this.isMovingBackward = false;
        break;
      case 'KeyA':
        this.isMovingLeft = false;
        break;
      case 'KeyD':
        this.isMovingRight = false;
        break;
      case 'Space':
        this.isMovingUp = false;
        break;
      case 'ShiftLeft':
        this.isMovingDown = false;
        break;
    }
  }

  public update(cameraDirection: THREE.Vector3, deltaTime: number, chunk: Chunk): void {
    //! Update UI
    this.updateUI();

    const cameraRight = new THREE.Vector3()
      .crossVectors(new THREE.Vector3(0, 1, 0), cameraDirection)
      .normalize()
      .negate();

    this.direction.set(0, 0, 0);

    if (this.isMovingForward) {
      const forwardVector = cameraDirection.clone();
      forwardVector.y = 0;
      forwardVector.normalize();
      this.direction.add(forwardVector);
    }
    if (this.isMovingBackward) {
      const backwardVector = cameraDirection.clone();
      backwardVector.y = 0;
      backwardVector.normalize();
      this.direction.sub(backwardVector);
    }
    if (this.isMovingLeft) {
      this.direction.sub(cameraRight);
    }
    if (this.isMovingRight) {
      this.direction.add(cameraRight);
    }

    this.direction.normalize();

    // Apply movement speed
    this.direction.multiplyScalar(this.speed * deltaTime);

    //TODO: Seperate concerns for movement and physics
    if (this.isFlying) {
      // Flying mode: apply vertical movement
      if (this.isMovingUp) {
        this.velocity.y = this.speed * deltaTime;
      } else if (this.isMovingDown) {
        this.velocity.y = -this.speed * deltaTime;
      } else {
        this.velocity.y = 0; // No vertical movement
      }
    } else {
      // Gravity effect when not flying
      this.velocity.y -= this.gravity * deltaTime * this.mass;
    }

    const intendedPosition = new THREE.Vector3(
      this.position.x + this.direction.x * this.speed * deltaTime,
      this.position.y + this.velocity.y * deltaTime,
      this.position.z + this.direction.z * this.speed * deltaTime
    );

    const collisionResult = this.physics.checkCollision(
      intendedPosition,
      this.radius,
      this.height,
      chunk
    );

    if (collisionResult.hasCollision) {
      const resolution = this.physics.resolveCollisions(
        intendedPosition,
        this.velocity,
        collisionResult.collisions
      );

      this.position.copy(resolution.position);
      this.velocity.copy(resolution.velocity);

      if (resolution.isOnGround) {
        this.canJump = true; // Allow jumping again when on ground
      }
    } else {
      // No collision, update position directly
      this.position.copy(intendedPosition);
    }

    /*     // Update player position based on direction and velocity
    this.position.x += this.direction.x;
    this.position.z += this.direction.z;
    this.position.y += this.velocity.y * deltaTime; */

    // Update camera position to match player position
    // this.camera.position.copy(this.position.clone().add(new THREE.Vector3(0, this.height / 2, 0)));
  }

  public getPosition(): THREE.Vector3 {
    return this.position.clone();
  }

  //! For debugging purposes, update the UI with player position
  public updateUI(): void {
    const { x, y, z } = this.getPosition();
    const positionText = `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`;
    document.querySelector('.player-position')!.textContent = positionText;
  }
}
