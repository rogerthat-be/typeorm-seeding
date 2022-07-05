import { Seeding } from '../../src/seeding'
import { getCommandConfig } from '../../src/configuration/get-command-config'

describe(getCommandConfig, () => {
  test('Should get default data source', async () => {
    Seeding.reconfigure({ root: __dirname, seedingConfig: '../seeding.ts' })
    const options = await getCommandConfig()

    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.defaultSeeder).toBeDefined()
  })

  test('Should get memory data source', async () => {
    Seeding.reconfigure({ root: __dirname, seedingConfig: '../seeding.ts' })
    const options = await getCommandConfig()

    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.defaultSeeder).toBeDefined()
  })

  test('Should get default data source with overrided env variables', async () => {
    const OLD_ENV = { ...process.env }
    process.env.TYPEORM_SEEDING_SEEDERS = 'overrided'
    process.env.TYPEORM_SEEDING_DEFAULT_SEEDER = 'overrided'

    Seeding.reconfigure({ root: __dirname, seedingConfig: '../seeding.ts' })
    const options = await getCommandConfig()
    expect(options.seeders).toBeDefined()
    expect(options.seeders).toBeInstanceOf(Array)
    expect(options.seeders).toEqual(['overrided'])
    expect(options.defaultSeeder).toBeDefined()
    expect(options.defaultSeeder).toBe('overrided')

    process.env = { ...OLD_ENV }
  })
})
