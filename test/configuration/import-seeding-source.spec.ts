import { PetSeeder } from '../__fixtures__/seeders/pet.seeder'
import { SeedingSource } from '../../src/seeding-source'
import { UserSeeder } from '../__fixtures__/seeders/user.seeder'
import { importSeedingSource } from '../../src/configuration/import-seeding-source'

describe(importSeedingSource, () => {
  test('Should get seed command configuration', async () => {
    const options: SeedingSource = await importSeedingSource('../__fixtures__/seeding.js', __dirname)

    const seeders = options.seeders
    expect(seeders[0]).toBe(UserSeeder)
    expect(seeders[1]).toBe(PetSeeder)

    const defaultSeeders = options.defaultSeeders
    expect(defaultSeeders).toBeDefined()
    if (defaultSeeders) {
      expect(defaultSeeders[0]).toBe(UserSeeder)
    }
  })
})
