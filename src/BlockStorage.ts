import { AirBlock, type Block } from './Block';

class BlockStorage {
  private block: Block[][][] = [];

  constructor(private readonly x: number, private readonly y: number, private readonly z: number) {
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.x; i++) {
      this.block[i] = [];
      for (let j = 0; j < this.y; j++) {
        this.block[i][j] = [];
        for (let k = 0; k < this.z; k++) {
          this.block[i][j][k] = new AirBlock();
        }
      }
    }
  }

  public getBlock(x: number, y: number, z: number): Block | undefined {
    if (this.block[x] && this.block[x][y] && this.block[x][y][z] !== undefined) {
      return this.block[x][y][z];
    }
    return undefined;
  }

  public setBlock(x: number, y: number, z: number, block: Block): boolean {
    if (!this.getBlock(x, y, z)) {
      return false;
    }

    this.block[x][y][z] = block;
    return true;
  }

  public hasBlock(x: number, y: number, z: number): boolean {
    return this.block[x] && this.block[x][y] && this.block[x][y][z] !== undefined;
  }

  public deleteBlock(x: number, y: number, z: number): boolean {
    if (this.hasBlock(x, y, z)) {
      this.block[x][y][z] = new AirBlock();
      return true;
    }

    return false;
  }

  public clear(): void {
    this.initialize();
  }
}

export default BlockStorage;
