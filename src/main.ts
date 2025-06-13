import '@/styles/style.css';

import { Chunk } from '@/world/Chunk';
import { createGUI } from '@/ui/GUI';
import TextureManager from './TextureManager';
import { ChunkRenderer } from './rendering/ChunkRenderer';
import Game from './core/Game';

// TextureManager initialization
await TextureManager.getInstance()
  .loadTextures()
  .then(() => {
    console.log('Textures loaded successfully');
  });

// Initialize the game
const game = new Game();

//! Initialize and generate a chunk
const chunk = new Chunk();
chunk.generate();
const chunkRenderer = new ChunkRenderer(chunk);
chunkRenderer.render();
game.scene.add(chunkRenderer);

// Start the game loop
game.start();

createGUI(chunk, chunkRenderer);
