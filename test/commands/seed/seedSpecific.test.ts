import { SeedCommand } from '../../../src/commands/seed.command'
import { reconfigureDataSource } from '../../../src'
import yargs from 'yargs'

describe(SeedCommand, () => {
  let command: SeedCommand

  beforeEach(async () => {
    reconfigureDataSource({})
    command = new SeedCommand()
  })

  describe(SeedCommand.prototype.handler, () => {
    test('Should use default values', async () => {
      await expect(
        yargs.command(command).parse('seed -d test/ormconfig.ts -c test/seeding.ts -s UserSeeder'),
      ).resolves.toBeTruthy()
    })
  })
})
