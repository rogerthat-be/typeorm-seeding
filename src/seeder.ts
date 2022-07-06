import { DataSource, ObjectLiteral } from 'typeorm'
import { FactoriesConfiguration, SeederTypeOrClass } from './types'

import { Factory } from './factory'
import { resolveFactory } from './utils/resolve-factory.util'

export interface SeederOptions<Entities> {
  factories?: FactoriesConfiguration<Entities>
  seeders?: SeederTypeOrClass[]
}

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
  constructor(private overrides: SeederOptions<Entities> = {}) {}

  /**
   * Run the seeder logic.
   *
   * @param dataSource TypeORM data source
   */
  abstract run(dataSource: DataSource): Promise<void>

  /**
   * Helper method for running sub-seeders.
   *
   * @param dataSource TypeORM data source
   * @param seeders Array of seeders to run
   */
  protected async call(dataSource: DataSource, seeders: SeederTypeOrClass[] = []): Promise<void> {
    const allSeeders = this.seeders(seeders)

    for (const seeder of allSeeders) {
      if (seeder instanceof Seeder) {
        await seeder.run(dataSource)
      } else {
        await new seeder().run(dataSource)
      }
    }
  }

  /**
   * Return an instance of the factory for the given key.
   *
   * @param key key of factory to return
   */
  public factory<K extends keyof FactoriesConfiguration<Entities>>(key: K): Factory<Entities[K]> {
    return resolveFactory(key, this.options.factories, this.overrides.factories)
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
  protected seeders(seeders: SeederTypeOrClass[] = []): SeederTypeOrClass[] {
    return seeders.length
      ? seeders
      : this.overrides.seeders?.length
      ? this.overrides.seeders
      : this.options.seeders?.length
      ? this.options.seeders
      : []
  }
}
