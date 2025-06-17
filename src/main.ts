import '@/styles/style.css';

import { Chunk } from '@/world/Chunk';
import { createGUI } from '@/ui/GUI';
import TextureManager from './rendering/TextureManager';
import { ChunkRenderer } from './rendering/ChunkRenderer';
import Game from './core/Game';

// TextureManager initialization
TextureManager.getInstance()
  .loadTextures()
  .then(() => {
    console.log('Textures loaded successfully');

    //! Initialize and generate a chunk
    const chunk = new Chunk();
    chunk.generate();
    const chunkRenderer = new ChunkRenderer(chunk);
    chunkRenderer.render();

    // Initialize the game
    //TODO: All these will be handled inside World class
    // For now, we just create a Game instance with the chunk
    // This will also handle the scene, camera, and renderer setup
    const game = new Game(chunk);

    game.scene.add(chunkRenderer);

    // Start the game loop
    game.start();

    createGUI(chunk, chunkRenderer);
  });
