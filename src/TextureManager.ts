import * as THREE from "three"
import { BlockType } from "./types/block"
import { BLOCK_FACES, TEXTURE_MAP } from "./constants/texture"

class TextureManager {
  private static instance: TextureManager | undefined = undefined

  private textures: Map<BlockType, THREE.Texture[]> = new Map()

  private constructor() {}

  public static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager()
    }

    return TextureManager.instance
  }

  public async loadTextures() {
    for (const [blockType, textures] of Object.entries(TEXTURE_MAP)) {
      if (textures) {
        const textureArray: THREE.Texture[] = []

        for (const face of BLOCK_FACES) {
          const texture = await new THREE.TextureLoader().loadAsync(
            textures[face as keyof typeof textures]
          )

          texture.magFilter = THREE.NearestFilter
          texture.minFilter = THREE.NearestFilter

          textureArray.push(texture)
        }

        this.textures.set(Number(blockType), textureArray)
      } else {
        this.textures.set(Number(blockType), [])
      }
    }
  }

  public getTextures(blockType: BlockType): THREE.Texture[] {
    return this.textures.get(blockType) || []
  }
}

export default TextureManager
