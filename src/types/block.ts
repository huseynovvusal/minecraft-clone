export type TBloockCoord = `${number},${number},${number}`

export enum BlockType {
  Air,
  Dirt,
  Grass,
  Stone,
  CoalOre,
  IronOre,
}

export interface IBlock {
  blockType: BlockType
  isSolid: boolean
  scale?: {
    x: number
    y: number
    z: number
  }
  scarcity?: number
}

export type TBlockFace = "top" | "bottom" | "left" | "right" | "front" | "back"

export type TBlockTextures = {
  [face in TBlockFace]: string
}

export type TBlockTextureMap = {
  [key in BlockType]: TBlockTextures | undefined
}
