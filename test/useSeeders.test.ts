import { fetchDataSource, reconfigureDataSource, useSeeders } from '../src'

import type { DataSource } from 'typeorm'
import { Pet } from './entities/Pet.entity'
import { PetSeeder } from './seeders/Pet.seeder'
import { User } from './entities/User.entity'
import { UserSeeder } from './seeders/User.seeder'

describe(useSeeders, () => {
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

  test(`Should seed with only one seeder provided`, async () => {
    await useSeeders(UserSeeder)

    const totalUsers = await dataSource.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await useSeeders([UserSeeder, PetSeeder])

    const [totalUsers, totalPets] = await Promise.all([
      dataSource.createEntityManager().count(User),
      dataSource.createEntityManager().count(Pet),
    ])

    expect(totalUsers).toBe(30)
    expect(totalPets).toBe(20)
  })

  test(`Should seed with custom options`, async () => {
    await useSeeders(UserSeeder)

    const totalUsers = await dataSource.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })
})
