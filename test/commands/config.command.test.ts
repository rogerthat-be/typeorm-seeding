import { ConfigCommand } from '../../src/commands/config.command'
import { Seeding } from '../../src/seeding'
import yargs from 'yargs'

describe(ConfigCommand, () => {
  let command: ConfigCommand

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => void 0)
    jest.spyOn(console, 'error').mockImplementation(() => void 0)
  })

  beforeEach(() => {
    Seeding.reconfigure({})
    command = new ConfigCommand()
  })

  describe(ConfigCommand.prototype.handler, () => {
    test('Should use the config file argument', async () => {
      expect(
        yargs.command(command).parse('config -c test/__fixtures__/seeding.js -d test/__fixtures__/ormconfig.js'),
      ).resolves.toBeTruthy()
    })

    test('Should use the config directory argument', async () => {
      expect(
        yargs.command(command).parse('config -c test/__fixtures__/seeding.js -d test/__fixtures__/ormconfig.js'),
      ).resolves.toBeTruthy()
    })

    test('Should throw error', async () => {
      const exitFn = jest.fn()
      jest.spyOn(process, 'exit').mockImplementationOnce(exitFn as any)

      await yargs.command(command).parse('config -c NOPE')

      expect(exitFn).toHaveBeenNthCalledWith(1, 1)
    })
  })
})
