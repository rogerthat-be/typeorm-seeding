import { DataSource } from 'typeorm'
import { Pet } from '../__fixtures__/entities/Pet.entity'
import { Pet2 } from '../__fixtures__/entities/Pet2.entity'
import { User } from '../__fixtures__/entities/User.entity'
import { User2 } from '../__fixtures__/entities/User2.entity'
import { importDataSource } from '../../src/configuration/import-data-source'

describe(importDataSource, () => {
  test('Should create a datasource from config file', async () => {
    const dataSource = await importDataSource('../__fixtures__/ormconfig.js', __dirname)

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
