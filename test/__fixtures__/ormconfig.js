const typeorm = require('typeorm')

module.exports = new typeorm.DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ['test/__fixtures__/entities/**/*.entity.ts'],
  synchronize: true,
})
