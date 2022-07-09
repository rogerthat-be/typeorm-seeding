import { DataSource } from 'typeorm'
import { SeedingSource } from '../src/configuration/seeding-source'

jest.mock(
  './__fixtures__/seeding.js',
  () =>
    new SeedingSource({
      seeders: ['test/__fixtures__/seeders/**/*.seeder.ts'],
      defaultSeeders: 'UserSeeder',
    }),
)

jest.mock(
  './__fixtures__/ormconfig.js',
  () =>
    new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: ['test/__fixtures__/entities/**/*.entity.ts'],
      synchronize: true,
    }),
)
