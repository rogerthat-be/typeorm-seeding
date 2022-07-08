import { DataSource } from 'typeorm'
import { Seeding } from '../../src/seeding'
import { fetchDataSource } from '../../src/configuration/fetch-data-source'

describe(fetchDataSource, () => {
  beforeEach(() => {
    Seeding.reconfigure({})
  })

  test('Should use an explicit data source', async () => {
    const explicitDataSource = new DataSource({ type: 'sqlite', database: ':memory:' })

    Seeding.configure({
      dataSource: explicitDataSource,
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource).toBe(explicitDataSource)
  })

  test('Should create a datasource from options', async () => {
    Seeding.configure({
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
    Seeding.configure({
      root: __dirname,
      dataSourceConfig: '../__fixtures__/ormconfig.js',
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        entities: ['test/__fixtures__/entities/**/*.entity.ts'],
        synchronize: true,
      }),
    )
  })
})
