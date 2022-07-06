import { DataSource, ObjectLiteral } from 'typeorm'
import { FactoriesConfiguration, SeederTypeOrClass } from './types'

import { Factory } from './factory'
import { resolveFactory } from './utils/resolve-factory.util'

export interface SeederOptions<Entities> {
  factories?: FactoriesConfiguration<Entities>
  seeders?: SeederTypeOrClass[]
}

export abstract class Seeder<Entities extends ObjectLiteral = ObjectLiteral> {
  protected abstract options: SeederOptions<Entities>

  constructor(private overrides: SeederOptions<Entities> = {}) {}

  abstract run(dataSource: DataSource): Promise<void>

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
