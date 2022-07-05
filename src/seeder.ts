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
    const allSeeders = [...seeders, ...this.seeders()]

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

  protected seeders(): SeederTypeOrClass[] {
    return [...(this.options.seeders ?? []), ...(this.overrides.seeders ?? [])]
  }
}
