import { DataSource } from 'typeorm'
import { Pet } from './__fixtures__/entities/Pet.entity'
import { Pet2 } from './__fixtures__/entities/Pet2.entity'
import { PetSeeder } from './__fixtures__/seeders/pet.seeder'
import { SeedingSource } from '../src/configuration/seeding-source'
import { User } from './__fixtures__/entities/User.entity'
import { User2 } from './__fixtures__/entities/User2.entity'
import { UserSeeder } from './__fixtures__/seeders/user.seeder'

jest.mock(
  './__fixtures__/seeding.js',
  () =>
    new SeedingSource({
      seeders: [UserSeeder, PetSeeder],
      defaultSeeders: [UserSeeder],
    }),
)

jest.mock(
  './__fixtures__/ormconfig.js',
  () =>
    new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, User2, Pet, Pet2],
      synchronize: true,
    }),
)
