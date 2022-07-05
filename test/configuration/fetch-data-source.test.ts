import { DataSource } from 'typeorm'
import { configure } from '../../src/configuration/configure'
import { fetchDataSource } from '../../src/configuration/fetch-data-source'
import { reconfigure } from '../../src/configuration/reconfigure'

describe(fetchDataSource, () => {
  beforeEach(() => {
    reconfigure()
  })

  test('Should use an explicit data source', async () => {
    const explicitDataSource = new DataSource({ type: 'sqlite', database: ':memory:' })

    configure({
      dataSource: explicitDataSource,
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource).toBe(explicitDataSource)
  })

  test('Should create a datasource from options', async () => {
    configure({
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
    configure({
      root: __dirname,
      dataSourceConfig: '../ormconfig.ts',
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
