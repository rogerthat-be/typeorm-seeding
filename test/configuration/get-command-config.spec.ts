import { Seeding } from '../../src/seeding'
import { SeedingCommandConfig } from '../../src/types'
import { getCommandConfig } from '../../src/configuration/get-command-config'

describe(getCommandConfig, () => {
  test('Should get seed command configuration', async () => {
    Seeding.reconfigure({
      root: __dirname,
      seedingConfig: '../__fixtures__/seeding.js',
    })

    const options: SeedingCommandConfig = await getCommandConfig()

    expect(options.seeders).toEqual(['test/__fixtures__/seeders/**/*.seeder.ts'])
    expect(options.defaultSeeder).toEqual('UserSeeder')
  })

  test('Should get seed command configuration overridden by env variables', async () => {
    Seeding.reconfigure({ root: __dirname, seedingConfig: '../__fixtures__/seeding.js' })

    const options: SeedingCommandConfig = await getCommandConfig()

    expect(options.seeders).toEqual(['test/__fixtures__/seeders/**/*.seeder.ts'])
    expect(options.defaultSeeder).toEqual('UserSeeder')

    const OLD_ENV = { ...process.env }
    process.env.TYPEORM_SEEDING_SEEDERS = 'overridden'
    process.env.TYPEORM_SEEDING_DEFAULT_SEEDER = 'overridden'

    const optionsOverride = await getCommandConfig()

    expect(optionsOverride.seeders).toEqual(['overridden'])
    expect(optionsOverride.defaultSeeder).toBeDefined()
    expect(optionsOverride.defaultSeeder).toBe('overridden')

    process.env = { ...OLD_ENV }
  })
})
