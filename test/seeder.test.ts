import type { DataSource } from 'typeorm'
import { Factory } from '../src/factory'
import { Pet } from './__fixtures__/entities/Pet.entity'
import { Pet2 } from './__fixtures__/entities/Pet2.entity'
import { PetSeeder } from './__fixtures__/seeders/Pet.seeder'
import { Seeder } from '../src/seeder'
import { Seeding } from '../src/seeding'
import { User } from './__fixtures__/entities/User.entity'
import { User2 } from './__fixtures__/entities/User2.entity'
import { UserFactory } from './__fixtures__/factories/User.factory'
import { UserSeeder } from './__fixtures__/seeders/User.seeder'
import { fetchDataSource } from '../src/configuration/fetch-data-source'

describe(Seeder, () => {
  let dataSource: DataSource

  beforeEach(async () => {
    Seeding.reconfigure({
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

  describe(Seeder.prototype.run, () => {
    test('Should seed users with overrides', async () => {
      class PetFactory2 extends Factory<Pet2, { user: User2 }> {
        protected options = { entity: Pet2, subFactories: { user: new UserFactory() } }

        protected async entity(pet: Pet2): Promise<Pet2> {
          pet.name = 'Fluggy'
          const user = await this.subFactory('user').create()
          pet.owner = user

          return pet
        }
      }

      await new UserSeeder({
        factories: { user: new UserFactory({ entity: User2 }) },
        seeders: [
          new PetSeeder({
            factories: {
              pet: new PetFactory2({ subFactories: { user: new UserFactory({ entity: User2 }) } }),
            },
          }),
        ],
      }).run(dataSource)

      const [totalUsers, totalPets] = await Promise.all([
        dataSource.createEntityManager().count(User2),
        dataSource.createEntityManager().count(Pet2),
      ])

      expect(totalUsers).toBe(20)
      expect(totalPets).toBe(10)
    })
  })
})
