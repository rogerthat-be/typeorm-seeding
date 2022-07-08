import { Seeding } from '../../src/seeding'
import { SeedingSource } from '../../src/configuration/seeding-source'
import { fetchSeedingSource } from '../../src/configuration/fetch-seeding-source'

describe(fetchSeedingSource, () => {
  test('Should get seed command configuration', async () => {
    Seeding.reconfigure({
      root: __dirname,
      seedingSourceFile: '../__fixtures__/seeding.js',
    })

    const options: SeedingSource = await fetchSeedingSource()

    expect(options.seeders).toEqual(['test/__fixtures__/seeders/**/*.seeder.ts'])
    expect(options.defaultSeeder).toEqual('UserSeeder')
  })

  test('Should get seed command configuration overridden by env variables', async () => {
    Seeding.reconfigure({ root: __dirname, seedingSourceFile: '../__fixtures__/seeding.js' })

    const options: SeedingSource = await fetchSeedingSource()

    expect(options.seeders).toEqual(['test/__fixtures__/seeders/**/*.seeder.ts'])
    expect(options.defaultSeeder).toEqual('UserSeeder')

    const OLD_ENV = { ...process.env }
    process.env.TYPEORM_SEEDING_SEEDERS = 'overridden'
    process.env.TYPEORM_SEEDING_DEFAULT_SEEDER = 'overridden'

    Seeding.reconfigure({
      root: __dirname,
      seedingSourceFile: '../__fixtures__/seeding.js',
    })

    const optionsOverride = await fetchSeedingSource()

    expect(optionsOverride.seeders).toEqual(['overridden'])
    expect(optionsOverride.defaultSeeder).toBeDefined()
    expect(optionsOverride.defaultSeeder).toBe('overridden')

    process.env = { ...OLD_ENV }
  })
})
