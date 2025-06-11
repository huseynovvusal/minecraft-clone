class SeedGenerator {
  constructor(private seed: number) {}

  public random(): number {
    this.seed = Math.sin(this.seed) * 10000

    return this.seed - Math.floor(this.seed)
  }
}

export default SeedGenerator
