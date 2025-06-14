class SeedGenerator {
  constructor(private seed: number) {}

  // Linear Congruential Generator (LCG) for reproducible pseudo-random numbers
  public random(): number {
    // Constants for LCG (Numerical Recipes)
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

export default SeedGenerator;
