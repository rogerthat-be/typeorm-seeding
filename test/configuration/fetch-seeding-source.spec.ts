import { PetSeeder } from '../__fixtures__/seeders/pet.seeder'
import { Seeding } from '../../src/seeding'
import { SeedingSource } from '../../src/configuration/seeding-source'
import { UserSeeder } from '../__fixtures__/seeders/user.seeder'
import { fetchSeedingSource } from '../../src/configuration/fetch-seeding-source'

describe(fetchSeedingSource, () => {
  test('Should get seed command configuration', async () => {
    Seeding.reconfigure({
      root: __dirname,
      seedingSourceFile: '../__fixtures__/seeding.js',
    })

    const options: SeedingSource = await fetchSeedingSource()

    const seeders = options.seeders
    expect(seeders[0]).toBe(UserSeeder)
    expect(seeders[1]).toBe(PetSeeder)

    const defaultSeeders = options.defaultSeeders
    expect(defaultSeeders[0]).toBe(UserSeeder)
  })
})
