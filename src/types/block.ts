export enum BlockType {
  Air,
  Dirt,
  Grass,
  Stone,
}

export interface Block {
  id: number
  type: BlockType
}
