import type { Player } from '@/Player';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';

class PlayerRenderer extends THREE.Group {
  public readonly camera: THREE.PerspectiveCamera;
  public readonly controls: PointerLockControls;

  private player: Player;

  // Helpers
  public cameraHelper: THREE.CameraHelper;

  // Player body representation
  private playerBody!: THREE.Group;

  constructor(player: Player) {
    super();
    this.player = player;

    this.position.copy(this.player.position);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight);

    this.camera.position.set(0, this.player.height, 0);

    this.rotation.copy(this.camera.rotation);

    this.cameraHelper = new THREE.CameraHelper(this.camera);

    this.controls = new PointerLockControls(this.camera, document.body);

    document.body.addEventListener('click', () => {
      this.controls.lock();
    });

    this.add(this.controls.getObject());

    this.createPlayerBody();
  }

  /**
   * Creates a cylinder mesh to represent the player's body
   */
  private createPlayerBody(): void {
    const height = this.player.height;
    const radius = this.player.radius;

    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 0x00ff00,
      //   transparent: true,
      //   opacity: 1,
    });

    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // Since cylinder origin is at center, offset it up by half height
    // cylinder.position.y = height / 2;

    this.playerBody = new THREE.Group();
    this.playerBody.add(cylinder);

    this.playerBody.position.set(0, this.player.height / 2, 0);
    this.add(this.playerBody);
  }

  /**
   * Update the renderer position and rotation based on the player's position and camera
   */
  public update(): void {
    // Update renderer's position to match player's feet position
    this.position.copy(this.player.position);

    if (this.playerBody) {
      // Make the player body face the direction the camera is looking
      const cameraDirection = new THREE.Vector3();
      this.camera.getWorldDirection(cameraDirection);

      const angle = Math.atan2(cameraDirection.x, cameraDirection.z);
      this.playerBody.rotation.y = angle;
    }
  }

  /**
   * Toggle visibility of debugging helpers
   */
  public toggleHelpers(visible: boolean): void {
    if (this.cameraHelper) {
      this.cameraHelper.visible = visible;
    }
  }
}

export default PlayerRenderer;
