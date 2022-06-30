import { configureDataSource, reconfigureDataSource } from '../../src/data-source'

import { DataSource } from 'typeorm'
import { DataSourceConfiguration } from '../../src/types'
import { DataSourceConfigurationManager } from '../../src/data-source/DataSourceConfigurationManager'

describe(configureDataSource, () => {
  const configurationManager = DataSourceConfigurationManager.getInstance()

  beforeEach(() => {
    reconfigureDataSource()
  })

  test('Should return initial config if not updated', async () => {
    const initialConfig = configurationManager.configuration
    configureDataSource({
      root: '',
      seederConfig: 'seeding.ts',
    })

    expect(configurationManager.configuration).toMatchObject(initialConfig)
  })

  test('Should update data source configuration', async () => {
    const newConfig: DataSourceConfiguration = {
      dataSource: new DataSource({ type: 'sqlite', database: ':memory:' }),
      dataSourceOptions: { type: 'sqlite', database: ':memory:' },
      dataSourceConfig: 'path/to/orm/config',
      seederConfig: 'path/to/seeder/config',
    }
    configureDataSource(newConfig)

    expect(configurationManager.configuration.dataSource).toBeInstanceOf(DataSource)
    expect(configurationManager.configuration.dataSourceOptions).toEqual({ type: 'sqlite', database: ':memory:' })
    expect(configurationManager.configuration.dataSourceConfig).toEqual('path/to/orm/config')
    expect(configurationManager.configuration.seederConfig).toEqual('path/to/seeder/config')
  })
})
