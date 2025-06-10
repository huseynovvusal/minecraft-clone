import type { Block } from "./Block"
import type { TBloockCoord } from "./types/block"

class BlockStorage {
  private block: Map<TBloockCoord, Block> = new Map()

  static coordToKey(x: number, y: number, z: number): TBloockCoord {
    return `${x},${y},${z}`
  }

  public getBlock(x: number, y: number, z: number): Block | undefined {
    return this.block.get(BlockStorage.coordToKey(x, y, z))
  }

  public setBlock(x: number, y: number, z: number, block: Block): void {
    this.block.set(BlockStorage.coordToKey(x, y, z), block)
  }

  public hasBlock(x: number, y: number, z: number): boolean {
    return this.block.has(BlockStorage.coordToKey(x, y, z))
  }

  public deleteBlock(x: number, y: number, z: number): boolean {
    return this.block.delete(BlockStorage.coordToKey(x, y, z))
  }

  public clear(): void {
    this.block.clear()
  }
}

export default BlockStorage
