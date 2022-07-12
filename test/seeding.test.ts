import type { DataSource } from 'typeorm'
import { Pet } from './__fixtures__/entities/Pet.entity'
import { PetSeeder } from './__fixtures__/seeders/pet.seeder'
import { Seeding } from '../src/seeding'
import { User } from './__fixtures__/entities/User.entity'
import { UserSeeder } from './__fixtures__/seeders/user.seeder'
import { fetchDataSource } from '../src/configuration/fetch-data-source'

describe(Seeding.run, () => {
  let dataSource: DataSource

  beforeEach(async () => {
    Seeding.reconfigure({
      root: __dirname,
      dataSourceFile: '__fixtures__/ormconfig.js',
      seedingSourceFile: '__fixtures__/seeding.js',
    })
    dataSource = await fetchDataSource()
  })

  afterEach(async () => {
    await dataSource.dropDatabase()
    await dataSource.destroy()
  })

  test(`Should seed with only one seeder provided`, async () => {
    await Seeding.run([UserSeeder])

    const totalUsers = await dataSource.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await Seeding.run([UserSeeder, PetSeeder])

    const [totalUsers, totalPets] = await Promise.all([
      dataSource.createEntityManager().count(User),
      dataSource.createEntityManager().count(Pet),
    ])

    expect(totalUsers).toBe(30)
    expect(totalPets).toBe(20)
  })

  test(`Should seed with custom seeder source file`, async () => {
    Seeding.reconfigure({})

    await Seeding.run({
      root: __dirname,
      dataSourceFile: '__fixtures__/ormconfig.js',
      seedingSourceFile: '__fixtures__/seeding.js',
    })

    const totalUsers = await dataSource.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })
})
