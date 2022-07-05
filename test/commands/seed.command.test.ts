import { SeedCommand } from '../../src/commands/seed.command'
import { reconfigure } from '../../src/configuration/reconfigure'
import yargs from 'yargs'

describe(SeedCommand, () => {
  let command: SeedCommand
  const exitFn = jest.fn()

  beforeEach(async () => {
    exitFn.mockClear()
    reconfigure({})
    command = new SeedCommand()
  })

  describe(SeedCommand.prototype.handler, () => {
    test('Should use default values', async () => {
      await expect(
        yargs.command(command).parse('seed -d test/ormconfig.ts -c test/seeding.ts -s UserSeeder'),
      ).resolves.toBeTruthy()
    })
  })

  describe(SeedCommand.prototype.handler, () => {
    test('Should throw error if config file is not valid', async () => {
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('seed -c foo')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })

    test('Should throw error if seeder is not valid', async () => {
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('seed -s FooSeeder')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })

    test('Should throw error if seeder fail to run', async () => {
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('seed')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })
  })
})
