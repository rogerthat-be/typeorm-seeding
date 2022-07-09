import { SeederInstanceOrClass, SeedingConfig } from './types'

import { ConfigManager } from './configuration/config-manager'
import { Seeder } from './seeder'
import { fetchDataSource } from './configuration/fetch-data-source'
import { fetchSeedingSource } from './configuration/fetch-seeding-source'

/**
 * Seeding
 */
export class Seeding {
  static configure(configOverrides: SeedingConfig) {
    ConfigManager.getInstance().merge(configOverrides)
  }

  static reconfigure(configuration: SeedingConfig) {
    ConfigManager.getInstance().replace(configuration)
  }

  static async run(seedersOrConfig?: SeederInstanceOrClass[] | SeedingConfig): Promise<void>

  static async run(entrySeeders: SeederInstanceOrClass[], configOverrides?: SeedingConfig): Promise<void>

  static async run(
    seedersOrConfig: SeederInstanceOrClass[] | SeedingConfig,
    configOverrides: SeedingConfig = {},
  ): Promise<void> {
    let seeders: SeederInstanceOrClass[] = []
    let config: SeedingConfig = {}

    if (seedersOrConfig instanceof Array) {
      seeders = seedersOrConfig
      config = configOverrides
    } else {
      config = seedersOrConfig
    }

    this.configure(config)

    const dataSource = await fetchDataSource()

    if (!seeders.length) {
      const seedingSource = await fetchSeedingSource()
      const resolvedSeeders = await seedingSource.seeders()

      if (resolvedSeeders) {
        for (const s in resolvedSeeders) {
          seeders.push(resolvedSeeders[s])
        }
      }
    }

    for (const seeder of seeders) {
      if (seeder instanceof Seeder) {
        await seeder.run(dataSource)
      } else {
        await new seeder().run(dataSource)
      }
    }
  }
}
