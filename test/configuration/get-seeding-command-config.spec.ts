import { getSeedingCommandConfig } from '../../src/configuration/get-seeding-command-config'
import { reconfigure } from '../../src/configuration/reconfigure'

describe(getSeedingCommandConfig, () => {
  test('Should get default data source', async () => {
    reconfigure({ root: __dirname, seedingConfig: '../seeding.ts' })
    const options = await getSeedingCommandConfig()

    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.defaultSeeder).toBeDefined()
  })

  test('Should get memory data source', async () => {
    reconfigure({ root: __dirname, seedingConfig: '../seeding.ts' })
    const options = await getSeedingCommandConfig()

    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.defaultSeeder).toBeDefined()
  })

  test('Should get default data source with overrided env variables', async () => {
    const OLD_ENV = { ...process.env }
    process.env.TYPEORM_SEEDING_SEEDERS = 'overrided'
    process.env.TYPEORM_SEEDING_DEFAULT_SEEDER = 'overrided'

    reconfigure({ root: __dirname, seedingConfig: '../seeding.ts' })
    const options = await getSeedingCommandConfig()
    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.seeders).toEqual(['overrided'])
    expect(options.defaultSeeder).toBeDefined()
    expect(options.defaultSeeder).toBe('overrided')

    process.env = { ...OLD_ENV }
  })
})
