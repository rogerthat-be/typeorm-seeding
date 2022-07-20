import { ClassConstructor, ExtractFactory, SeederInstanceOrClass, SeederOptions, SeederOptionsOverrides } from './types'

import { SeedingSource } from './seeding-source'
import { resolveFactory } from './utils/resolve-factory.util'
import { resolveSeeders } from './utils/resolve-seeders.util'

/**
 * Seeder
 */
export abstract class Seeder {
  /**
   * Options
   */
  protected options: SeederOptions = {}

  /**
   * Constructor
   *
   * @param optionOverrides option overrides
   */
  constructor(private optionOverrides: SeederOptionsOverrides = {}) {}

  get seedingSource() {
    if (this.optionOverrides.seedingSource instanceof SeedingSource) {
      return this.optionOverrides.seedingSource
    } else {
      throw new Error(`SeedingSource options was not set for Seeder ${Object.getPrototypeOf(this).constructor.name}`)
    }
  }

  set seedingSource(seedingSource: SeedingSource) {
    this.optionOverrides.seedingSource = seedingSource
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
  protected async call(seeders?: SeederInstanceOrClass[]): Promise<void> {
    const seedersToRun = this.seeders(seeders)
    await this.seedingSource.run.many(seedersToRun)
  }

  /**
   * Return an instance of the factory for the given factory class.
   */
  factory<T>(factory: ClassConstructor<ExtractFactory<T>>): ExtractFactory<T> {
    return resolveFactory(this.seedingSource, factory, this.optionOverrides.factories)
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
  protected seeders(seeders?: SeederInstanceOrClass[]): Seeder[] {
    const whichSeeders = seeders
      ? seeders
      : this.optionOverrides.seeders
      ? this.optionOverrides.seeders
      : this.options.seeders
      ? this.options.seeders
      : []

    return resolveSeeders(this.seedingSource, whichSeeders)
  }
}
