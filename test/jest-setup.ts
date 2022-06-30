jest.mock('./ormconfig.ts', () => ({
  type: 'sqlite',
  database: ':memory:',
  entities: ['test/entities/**/*.entity.ts'],
  synchronize: true,
}))

jest.mock('./seeding.ts', () => ({
  seeders: ['test/seeders/**/*.seeder.ts'],
  defaultSeeder: 'UserSeeder',
}))
