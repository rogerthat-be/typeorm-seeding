import { configureDataSource, fetchDataSource, reconfigureDataSource } from '../../src/data-source'

import { DataSource } from 'typeorm'

describe(fetchDataSource, () => {
  beforeEach(() => {
    reconfigureDataSource()
  })

  test('Should use an explicit data source', async () => {
    const explicitDataSource = new DataSource({ type: 'sqlite', database: ':memory:' })

    configureDataSource({
      dataSource: explicitDataSource,
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource).toBe(explicitDataSource)
  })

  test('Should create a datasource from options', async () => {
    configureDataSource({
      dataSourceOptions: {
        type: 'sqlite',
        database: ':memory:',
        entities: ['abcdefg'],
      },
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        entities: ['abcdefg'],
      }),
    )
  })

  test('Should create a datasource from config file', async () => {
    configureDataSource({
      root: __dirname,
      dataSourceConfig: '../ormconfig.ts',
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        entities: ['test/entities/**/*.entity.ts'],
        synchronize: true,
      }),
    )
  })
})
