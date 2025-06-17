import { Player } from '@/Player';
import PlayerRenderer from '@/rendering/PlayerRenderer';
import { Chunk } from '@/world/Chunk';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

/**
 * Game class that initializes the Three.js renderer, camera, scene, and controls.
 * It also sets up lighting and performance stats for the game environment.
 */
class Game {
  public readonly renderer = new THREE.WebGLRenderer();
  public readonly camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
  // Controls for the debugging camera, used when not in player view
  private readonly controls = new OrbitControls(this.camera, this.renderer.domElement);
  public readonly scene = new THREE.Scene();
  public readonly stats = new Stats();

  private player: Player;
  private playerRenderer: PlayerRenderer;

  private readonly clock = new THREE.Clock();
  private deltaTime: number = 0;

  //! Testing: Marker to visualize player's position
  private playerPositionMarker: THREE.Mesh;

  private debugCubes: THREE.Mesh[] = [];
  private readonly maxDebugCubes = 32; // Adjust as needed
  private debugCubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.5,
  });

  constructor(private readonly chunk: Chunk) {
    this.setupRenderer();
    this.setupCamera();
    this.setupStats();
    this.setupScene();
    this.setupLights();

    // Initialize player
    this.player = new Player();

    // Initialize player renderer (handles both player body and camera)
    this.playerRenderer = new PlayerRenderer(this.player);
    this.scene.add(this.playerRenderer);

    // Add the player's controls object to the scene
    // this.scene.add(this.playerRenderer.controls.getObject());

    //! Add the player's camera helper to the scene for debugging
    this.scene.add(this.playerRenderer.cameraHelper);

    //! Testing: Add an object to identify the player's position
    this.playerPositionMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 5, 5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.playerPositionMarker.position.copy(this.player.position);
    this.scene.add(this.playerPositionMarker);

    // Initialize debug cubes pool
    for (let i = 0; i < this.maxDebugCubes; i++) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1 + 1e-3, 1 + 1e-3, 1 + 1e-3),
        this.debugCubeMaterial
      );
      cube.visible = false;
      this.debugCubes.push(cube);
      this.scene.add(cube);
    }
  }

  /**
   * Sets up the WebGL renderer with appropriate settings.
   */
  private setupRenderer(): void {
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  /**
   * Sets up the camera with initial position and orientation.
   */
  private setupCamera(): void {
    this.camera.position.set(128, 128, 128);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  /**
   * Sets up the stats panel for performance monitoring.
   */
  private setupStats(): void {
    this.stats.showPanel(0);

    document.body.appendChild(this.stats.dom);
  }

  /**
   * Sets up the scene with background color and shadow settings.
   */
  private setupScene(): void {
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    this.scene.castShadow = true;
    this.scene.receiveShadow = true;
    // this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.025); // Fog effect

    // For testing
    this.scene.add(new THREE.GridHelper(500, 100));

    /*     // !Testing
    const testObject = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 })
    );

    testObject.position.set(5, 17, 37);

    this.scene.add(testObject); */
  }

  /**
   * Sets up lighting for the scene, including ambient and directional lights.
   */
  private setupLights() {
    // Ambient light setup
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.25;
    this.scene.add(ambientLight);

    // Directional light setup
    const directionalLight = new THREE.DirectionalLight();
    directionalLight.castShadow = true;

    directionalLight.position.set(50, 50, 50);

    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.bias = -0.01;

    directionalLight.shadow.mapSize = new THREE.Vector2(512, 512); // Higher resolution for shadows

    this.scene.add(directionalLight);

    // Shadow helpers for debugging
    // const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // this.scene.add(directionalLightHelper);

    // For debugging purposes, add a helper
    // const planeGeometry = new THREE.PlaneGeometry(500, 500);
    // const planeMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xcccccc,
    //   transparent: true,
    //   opacity: 0.75,
    // });
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.rotation.x = -Math.PI / 2;
    // plane.position.y = 25;
    // plane.receiveShadow = true;
    // this.scene.add(plane);
  }

  /**
   * Main update loop for rendering the scene and updating controls.
   */
  public update(): void {
    requestAnimationFrame(() => this.update());

    this.deltaTime = this.clock.getDelta();

    this.stats.begin();

    if (this.player) {
      const cameraDirection = new THREE.Vector3();
      this.playerRenderer.camera.getWorldDirection(cameraDirection);

      if (this.playerRenderer.controls.isLocked) {
        this.player.update(cameraDirection, this.deltaTime, this.chunk);

        if (this.playerRenderer) {
          this.playerRenderer.update();
        }
      }

      // !Testing: Update player position marker
      this.playerPositionMarker.position.copy(this.player.position);
    }

    // Update orbit controls when not in player view
    if (!this.playerRenderer.controls.isLocked) {
      this.controls.update();
    }

    if (this.playerRenderer.controls.isLocked) {
      this.renderer.render(this.scene, this.playerRenderer.camera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.stats.end();
  }

  /**
   * Handles window resize events to adjust camera and renderer settings.
   */
  public onWindowResize(): void {
    // Update orbit camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Update player camera aspect ratio
    this.playerRenderer.camera.aspect = window.innerWidth / window.innerHeight;
    this.playerRenderer.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Starts the game by initializing the update loop and setting up event listeners.
   */
  public start(): void {
    this.update();

    window.addEventListener('resize', () => this.onWindowResize());
  }
}

export default Game;
