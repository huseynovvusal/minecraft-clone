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
