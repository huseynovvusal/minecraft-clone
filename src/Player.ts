import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import Game from '@/core/Game';

export class Player {
  private readonly game: Game;
  private readonly camera: THREE.Camera;
  private readonly controls: PointerLockControls;

  // Player properties
  private position: THREE.Vector3;
  private velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private direction: THREE.Vector3 = new THREE.Vector3();

  // Movement state
  private isMovingForward: boolean = false;
  private isMovingBackward: boolean = false;
  private isMovingLeft: boolean = false;
  private isMovingRight: boolean = false;
  private isMovingUp: boolean = false;
  private isMovingDown: boolean = false;

  // Movement settings
  private readonly speed: number = 10;
  private readonly jumpHeight: number = 8;
  private readonly gravity: number = 9.81;

  // Physics flags
  private canJump: boolean = true;
  private isFlying: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.camera = game.camera;
    this.position = this.camera.position.clone();

    // Initialize Pointer Lock Controls
    this.controls = new PointerLockControls(this.camera, document.body);

    // Add controls to the scene
    document.body.addEventListener('click', () => {
      this.controls.lock();
    });

    this.setupKeyboardControls();
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

  public update(deltaTime: number): void {
    if (!this.controls.isLocked) return;

    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);

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

    //TODO: Apply physics or flight mode

    // Horizontal movement
    this.camera.position.x += this.direction.x;
    this.camera.position.z += this.direction.z;

    // Vertical movement
    this.camera.position.y += this.velocity.y * deltaTime;

    //TODO: Ground collision detection

    this.position.copy(this.camera.position);
  }

  public getPosition(): THREE.Vector3 {
    return this.position.clone();
  }

  public initialize(): void {
    this.game.scene.add(this.controls.getObject());

    console.log('Player initialized at position:', this.position);
  }
}
