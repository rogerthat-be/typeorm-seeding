import type { DataSource } from 'typeorm'
import { Factory } from '../src/factory'
import { FactoryOptions } from '../src/types'
import { Pet } from './__fixtures__/entities/Pet.entity'
import { Pet2 } from './__fixtures__/entities/Pet2.entity'
import { PetFactory } from './__fixtures__/factories/pet.factory'
import { PetSeeder } from './__fixtures__/seeders/pet.seeder'
import { Seeder } from '../src/seeder'
import { SeedingSource } from '../src/seeding-source'
import { User } from './__fixtures__/entities/User.entity'
import { User2 } from './__fixtures__/entities/User2.entity'
import { UserFactory } from './__fixtures__/factories/user.factory'
import { UserSeeder } from './__fixtures__/seeders/user.seeder'
import { importSeedingSource } from '../src/configuration/import-seeding-source'

describe(Seeder, () => {
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

  describe(Seeder.prototype.run, () => {
    test('Should seed users', async () => {
      await new UserSeeder({ seedingSource }).run()

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User),
        dataSource.createEntityManager().count(Pet),
      ])

      expect(totalUsers).toBe(20)
      expect(totalPets).toBe(10)
    })
  })

  describe(Seeder.prototype.run, () => {
    test('Should seed users with overrides', async () => {
      class PetFactory2 extends Factory<Pet2> {
        protected options: FactoryOptions<Pet2> = {
          entity: Pet2,
          override: PetFactory,
        }

        protected async entity(pet: Pet2): Promise<Pet2> {
          pet.name = 'Fluffy'
          const userFactory = this.factory(UserFactory)
          const user = await userFactory.create()
          pet.owner = user

          return pet
        }
      }

      const userFactory = new UserFactory({ entity: User2 })

      const petFactory2 = new PetFactory2({
        factories: [userFactory],
      })

      await new UserSeeder({
        seedingSource,
        factories: [userFactory],
        seeders: [
          new PetSeeder({
            factories: [petFactory2],
          }),
        ],
      }).run()

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User2),
        dataSource.createEntityManager().count(Pet2),
      ])

      expect(totalUsers).toBe(20)
      expect(totalPets).toBe(10)
    })
  })
})
