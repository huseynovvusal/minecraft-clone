import { BlockType, type TBlockFace, type TBlockTextureMap } from "@/types/block"

export const TEXTURE_MAP: TBlockTextureMap = {
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
  [BlockType.CoalOre]: {
    top: "/textures/blocks/coal_ore.png",
    bottom: "/textures/blocks/coal_ore.png",
    left: "/textures/blocks/coal_ore.png",
    right: "/textures/blocks/coal_ore.png",
    front: "/textures/blocks/coal_ore.png",
    back: "/textures/blocks/coal_ore.png",
  },
  [BlockType.IronOre]: {
    top: "/textures/blocks/iron_ore.png",
    bottom: "/textures/blocks/iron_ore.png",
    left: "/textures/blocks/iron_ore.png",
    right: "/textures/blocks/iron_ore.png",
    front: "/textures/blocks/iron_ore.png",
    back: "/textures/blocks/iron_ore.png",
  },
}

export const BLOCK_FACES: TBlockFace[] = ["right", "left", "top", "bottom", "front", "back"]
