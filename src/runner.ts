import { Seeder } from './seeder'
import { SeederInstanceOrClass } from './types'
import { SeedingSource } from './seeding-source'
import { resolveSeeders } from './utils/resolve-seeders.util'

/**
 * Runner
 */
export class Runner {
  constructor(readonly seedingSource: SeedingSource) {}

  async one(seeder: SeederInstanceOrClass): Promise<void> {
    return this.many([seeder])
  }

  async many(seeders: SeederInstanceOrClass[]): Promise<void> {
    const seedersToRun: Seeder[] = resolveSeeders(this.seedingSource, seeders)

    for (const seederToRun of seedersToRun) {
      await seederToRun.run()
    }
  }

  async defaults(): Promise<void> {
    const seeders = this.seedingSource.defaultSeeders
    return this.many(seeders)
  }

  async fromString(classNameString: string): Promise<void> {
    const seeders = this.seedingSource.seedersFromString(classNameString)
    return this.many(seeders)
  }
}
