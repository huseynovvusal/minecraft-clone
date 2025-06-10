import * as THREE from "three"
import { BlockType } from "./types/block"

type TBlockFace = "top" | "bottom" | "left" | "right" | "front" | "back"

type TBlockTextures = {
  [face in TBlockFace]: string
}

type TBlockTextureMap = {
  [key in BlockType]: TBlockTextures | undefined
}

const TEXTURE_MAP: TBlockTextureMap = {
  [BlockType.Air]: undefined,
  [BlockType.Dirt]: {
    top: "/textures/blocks/dirt.png",
    bottom: "/textures/blocks/dirt.png",
    left: "/textures/blocks/dirt.png",
    right: "/textures/blocks/dirt.png",
    front: "/textures/blocks/dirt.png",
    back: "/textures/blocks/dirt.png",
  },
  [BlockType.Grass]: {
    top: "/textures/blocks/grass_top.png",
    bottom: "/textures/blocks/dirt.png",
    left: "/textures/blocks/grass.png",
    right: "/textures/blocks/grass.png",
    front: "/textures/blocks/grass.png",
    back: "/textures/blocks/grass.png",
  },
  [BlockType.Stone]: {
    top: "/textures/blocks/stone.png",
    bottom: "/textures/blocks/stone.png",
    left: "/textures/blocks/stone.png",
    right: "/textures/blocks/stone.png",
    front: "/textures/blocks/stone.png",
    back: "/textures/blocks/stone.png",
  },
}

const blockFaces: TBlockFace[] = ["right", "left", "top", "bottom", "front", "back"]

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

        for (const face of blockFaces) {
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
