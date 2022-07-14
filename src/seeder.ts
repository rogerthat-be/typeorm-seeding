import { FactoriesConfiguration, SeederInstanceOrClass, SeederOptions } from './types'

import { Factory } from './factory'
import { ObjectLiteral } from 'typeorm'
import { SeedingSource } from './seeding-source'
import { resolveFactory } from './utils/resolve-factory.util'
import { resolveSeeders } from './utils/resolve-seeders.util'

/**
 * Seeder
 */
export abstract class Seeder<Entities extends ObjectLiteral = ObjectLiteral> {
  /**
   * Options
   */
  protected options: SeederOptions<Entities> = {}

  /**
   * Constructor
   *
   * @param overrides option overrides
   */
  constructor(private overrides: Partial<SeederOptions<Entities>> = {}) {}

  get seedingSource() {
    if (this.overrides.seedingSource instanceof SeedingSource) {
      return this.overrides.seedingSource
    } else {
      throw new Error(`SeedingSource options was not set for Seeder ${Object.getPrototypeOf(this).constructor.name}`)
    }
  }

  set seedingSource(seedingSource: SeedingSource) {
    this.overrides.seedingSource = seedingSource
  }

  /**
   * Run the seeder logic.
   */
  abstract run(): Promise<void>

  /**
   * Helper method for running sub-seeders.
   *
   * @param seeders Array of seeders to run
   */
  protected async call(seeders: SeederInstanceOrClass[] = []): Promise<void> {
    const seedersToRun = this.seeders(seeders)
    await this.seedingSource.runner.many(seedersToRun)
  }

  /**
   * Return an instance of the factory for the given key.
   *
   * @param key key of factory to return
   */
  public factory<K extends keyof FactoriesConfiguration<Entities>>(key: K): Factory<Entities[K]> {
    return resolveFactory(this.seedingSource, key, this.options.factories, this.overrides.factories)
  }

  /**
   * Return configured seeders.
   *
   * Seeders are NOT merged!
   *
   * Priority is:
   *
   * 1. Seeders passed explicitly
   * 2. Seeders passed as overrides
   * 3. Seeders set as class options
   */
  protected seeders(seeders: SeederInstanceOrClass[] = []): Seeder[] {
    const whichSeeders = seeders.length
      ? seeders
      : this.overrides.seeders?.length
      ? this.overrides.seeders
      : this.options.seeders?.length
      ? this.options.seeders
      : []

    return resolveSeeders(this.seedingSource, whichSeeders)
  }
}
