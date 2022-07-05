jest.mock('./test/ormconfig.ts', () => ({
  type: 'sqlite',
  database: ':memory:',
  entities: ['test/__fixtures__/entities/**/*.entity.ts'],
  synchronize: true,
}))

jest.mock('./test/seeding.ts', () => ({
  seeders: ['test/__fixtures__/seeders/**/*.seeder.ts'],
  defaultSeeder: 'UserSeeder',
}))
