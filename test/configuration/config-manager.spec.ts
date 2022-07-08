import { ConfigManager } from '../../src/configuration/config-manager'
import { DataSource } from 'typeorm'
import { SeedingConfig } from '../../src/types'

describe(ConfigManager.prototype.merge, () => {
  const configurationManager = ConfigManager.getInstance()

  beforeEach(() => {
    ConfigManager.getInstance().replace()
  })

  test('Should match default configuration', async () => {
    expect(configurationManager.configuration).toMatchObject({
      root: '',
      dataSourceFile: 'ormconfig.js',
      seedingSourceFile: 'seeding.js',
    })
  })

  test('Should update data source configuration', async () => {
    const newConfig: SeedingConfig = {
      dataSource: new DataSource({ type: 'sqlite', database: ':memory:' }),
      dataSourceOptions: { type: 'sqlite', database: ':memory:' },
      dataSourceFile: 'path/to/orm/config',
      seedingSourceFile: 'path/to/seeder/config',
    }
    ConfigManager.getInstance().merge(newConfig)

    expect(configurationManager.configuration.dataSource).toBeInstanceOf(DataSource)
    expect(configurationManager.configuration.dataSourceOptions).toEqual({ type: 'sqlite', database: ':memory:' })
    expect(configurationManager.configuration.dataSourceFile).toEqual('path/to/orm/config')
    expect(configurationManager.configuration.seedingSourceFile).toEqual('path/to/seeder/config')
  })
})
