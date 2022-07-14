import { Seeder } from '../seeder'
import { SeederInstanceOrClass } from '../types'
import { SeedingSource } from '../seeding-source'

/**
 * Resolve seeders
 */
export function resolveSeeders(seedingSource: SeedingSource, seeders: Array<SeederInstanceOrClass>): Seeder[] {
  // what we will return
  const seedersToReturn: Seeder[] = []

  // loop all of them
  for (const seeder of seeders) {
    // the seeder we will push
    const seederToReturn = seeder instanceof Seeder ? seeder : new seeder()
    // set the seeding source
    seederToReturn.seedingSource = seedingSource
    // push it
    seedersToReturn.push(seederToReturn)
  }

  // all done
  return seedersToReturn
}
