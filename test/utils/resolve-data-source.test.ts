import { DataSource } from 'typeorm'
import { Pet } from '../__fixtures__/entities/Pet.entity'
import { User } from '../__fixtures__/entities/User.entity'
import { resolveDataSource } from '../../src/utils/resolve-data-source'

describe(resolveDataSource, () => {
  test('Should use an explicit data source', async () => {
    const explicitDataSource = new DataSource({ type: 'sqlite', database: ':memory:' })

    const dataSource = resolveDataSource(explicitDataSource)

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource).toBe(explicitDataSource)
  })

  test('Should create a datasource from options', async () => {
    const dataSource = resolveDataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Pet],
    })

    expect(dataSource).toBeInstanceOf(DataSource)
    expect(dataSource.options).toEqual(
      expect.objectContaining({
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Pet],
      }),
    )
  })
})
