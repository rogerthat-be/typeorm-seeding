import { DataSource } from 'typeorm'
import { Pet } from '../__fixtures__/entities/Pet.entity'
import { Pet2 } from '../__fixtures__/entities/Pet2.entity'
import { Seeding } from '../../src/seeding'
import { User } from '../__fixtures__/entities/User.entity'
import { User2 } from '../__fixtures__/entities/User2.entity'
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
        entities: [User, Pet],
      },
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Pet],
      }),
    )
  })

  test('Should create a datasource from config file', async () => {
    Seeding.configure({
      root: __dirname,
      dataSourceFile: '../__fixtures__/ormconfig.js',
    })

    const dataSource = await fetchDataSource()

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, User2, Pet, Pet2],
        synchronize: true,
      }),
    )
  })
})
