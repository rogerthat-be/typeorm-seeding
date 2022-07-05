import { ConfigManager } from '../../src/configuration/config-manager'
import { DataSource } from 'typeorm'
import { SeedingConfig } from '../../src/types'
import { configure } from '../../src/configuration/configure'
import { reconfigure } from '../../src/configuration/reconfigure'

describe(configure, () => {
  const configurationManager = ConfigManager.getInstance()

  beforeEach(() => {
    reconfigure()
  })

  test('Should return initial config if not updated', async () => {
    const initialConfig = configurationManager.configuration
    configure({
      root: '',
      seedingConfig: 'seeding.ts',
    })

    expect(configurationManager.configuration).toMatchObject(initialConfig)
  })

  test('Should update data source configuration', async () => {
    const newConfig: SeedingConfig = {
      dataSource: new DataSource({ type: 'sqlite', database: ':memory:' }),
      dataSourceOptions: { type: 'sqlite', database: ':memory:' },
      dataSourceConfig: 'path/to/orm/config',
      seedingConfig: 'path/to/seeder/config',
    }
    configure(newConfig)

    expect(configurationManager.configuration.dataSource).toBeInstanceOf(DataSource)
    expect(configurationManager.configuration.dataSourceOptions).toEqual({ type: 'sqlite', database: ':memory:' })
    expect(configurationManager.configuration.dataSourceConfig).toEqual('path/to/orm/config')
    expect(configurationManager.configuration.seedingConfig).toEqual('path/to/seeder/config')
  })
})
