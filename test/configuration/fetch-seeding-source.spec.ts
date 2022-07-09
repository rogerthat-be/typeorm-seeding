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

    const seeders = await options.seeders()
    expect(seeders[0]).toBe(PetSeeder)
    expect(seeders[1]).toBe(UserSeeder)

    const defaultSeeders = await options.defaultSeeders()
    expect(defaultSeeders[0]).toBe(UserSeeder)
  })

  test('Should get seed command configuration overridden by env variables', async () => {
    Seeding.reconfigure({ root: __dirname, seedingSourceFile: '../__fixtures__/seeding.js' })

    const options: SeedingSource = await fetchSeedingSource()

    const seeders = await options.seeders()
    expect(seeders[0]).toBe(PetSeeder)
    expect(seeders[1]).toBe(UserSeeder)

    const defaultSeeders = await options.defaultSeeders()
    expect(defaultSeeders[0]).toBe(UserSeeder)

    const OLD_ENV = { ...process.env }
    process.env.TYPEORM_SEEDING_DEFAULT_SEEDERS = 'PetSeeder'

    Seeding.reconfigure({
      root: __dirname,
      seedingSourceFile: '../__fixtures__/seeding.js',
    })

    const optionsOverride = await fetchSeedingSource()

    const seeders2 = await options.seeders()
    expect(seeders2[0]).toBe(PetSeeder)
    expect(seeders2[1]).toBe(UserSeeder)

    const defaultSeeders2 = await optionsOverride.defaultSeeders()
    expect(defaultSeeders2[0]).toBe(PetSeeder)

    process.env = { ...OLD_ENV }
  })
})
