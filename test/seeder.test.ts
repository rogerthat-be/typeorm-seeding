import { Seeder, fetchDataSource, reconfigureDataSource } from '../src'

import type { DataSource } from 'typeorm'
import { Pet } from './entities/Pet.entity'
import { User } from './entities/User.entity'
import { UserSeeder } from './seeders/User.seeder'

describe(Seeder, () => {
  let dataSource: DataSource

  beforeEach(async () => {
    reconfigureDataSource({
      root: __dirname,
      dataSourceConfig: 'ormconfig.ts',
    })

    dataSource = await fetchDataSource()
  })

  afterEach(async () => {
    await dataSource.dropDatabase()
    await dataSource.destroy()
  })

  describe(Seeder.prototype.run, () => {
    test('Should seed users', async () => {
      await new UserSeeder().run(dataSource)

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(20)
      expect(totalPets).toBe(10)
    })
  })
})
