import type { DataSource } from 'typeorm'
import { Pet } from './__fixtures__/entities/Pet.entity'
import { PetSeeder } from './__fixtures__/seeders/pet.seeder'
import { Runner } from '../src/runner'
import { SeedingSource } from '../src'
import { User } from './__fixtures__/entities/User.entity'
import { UserSeeder } from './__fixtures__/seeders/user.seeder'
import { importSeedingSource } from '../src/configuration/import-seeding-source'

describe(Runner, () => {
  let dataSource: DataSource
  let seedingSource: SeedingSource

  beforeEach(async () => {
    seedingSource = await importSeedingSource('__fixtures__/seeding.js', __dirname)
    dataSource = seedingSource.dataSource
    await dataSource.initialize()
  })

  afterEach(async () => {
    await dataSource.dropDatabase()
    await dataSource.destroy()
  })

  test(`Should seed with only one seeder provided`, async () => {
    await seedingSource.run.one(UserSeeder)

    const totalUsers = await dataSource.createEntityManager().count(User)

    expect(totalUsers).toBe(20)
  })

  test(`Should seed with multiple seeders provided`, async () => {
    await seedingSource.run.many([UserSeeder, PetSeeder])

    const [totalUsers, totalPets] = await Promise.all([
      dataSource.createEntityManager().count(User),
      dataSource.createEntityManager().count(Pet),
    ])

    expect(totalUsers).toBe(30)
    expect(totalPets).toBe(20)
  })
})
