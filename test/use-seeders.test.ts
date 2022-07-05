import type { DataSource } from 'typeorm'
import { Pet } from './__fixtures__/entities/Pet.entity'
import { PetSeeder } from './__fixtures__/seeders/Pet.seeder'
import { User } from './__fixtures__/entities/User.entity'
import { UserSeeder } from './__fixtures__/seeders/User.seeder'
import { fetchDataSource } from '../src/configuration/fetch-data-source'
import { reconfigure } from '../src/configuration/reconfigure'
import { useSeeders } from '../src/use-seeders'

describe(useSeeders, () => {
  let dataSource: DataSource

  beforeEach(async () => {
    reconfigure({
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
