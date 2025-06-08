export enum BlockType {
  Air,
  Dirt,
  Grass,
  Stone,
}

export interface IBlock {
  id: number
  type: BlockType
  isSolid: boolean
}
