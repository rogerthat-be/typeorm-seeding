import { Arguments, Argv, CommandModule, exit } from 'yargs'
import ora, { Ora } from 'ora'

import { ClassConstructor } from '../types'
import { Seeder } from '../seeder'
import { Seeding } from '../seeding'
import { SeedingSource } from '../configuration/seeding-source'
import { fetchSeedingSource } from '../configuration/fetch-seeding-source'
import { gray } from 'chalk'

interface SeedCommandArguments extends Arguments {
  root?: string
  dataSource?: string
  seedingSource?: string
  seed?: string
}

export class SeedCommand implements CommandModule {
  command = 'seed'
  describe = 'Runs the seeds'

  /**
   * @inheritdoc
   */
  builder(args: Argv) {
    return args
      .option('r', {
        alias: 'root',
        type: 'string',
        describe: 'Path to project root',
        default: process.cwd(),
      })
      .option('d', {
        alias: 'dataSource',
        type: 'string',
        describe: 'Path to the data source config file.',
      })
      .option('c', {
        alias: 'seedingSource',
        type: 'string',
        describe: 'Path to the seeder config file.',
      })
      .option('s', {
        alias: 'seed',
        type: 'string',
        describe: 'Specific seed class to run.',
      })
  }

  /**
   * @inheritdoc
   */
  async handler(args: SeedCommandArguments) {
    const spinner = ora({ text: 'Loading ormconfig', isSilent: process.env.NODE_ENV === 'test' }).start()

    // Get seeding source
    let seedingSource!: SeedingSource
    const rootPath = args.root && args.root[0] === '.' ? process.cwd() + '/' + args.root : args.root

    try {
      Seeding.configure({
        root: rootPath,
        dataSourceFile: args.dataSource,
        seedingSourceFile: args.seedingSource,
      })
      seedingSource = await fetchSeedingSource()
      spinner.succeed('Seeding Config loaded')
    } catch (error) {
      panic(spinner, error, `Could not load the config file at ${rootPath}!`)
      return
    }

    // Show seeder in console
    spinner.start('Importing Seeders')

    let seeders!: ClassConstructor<Seeder>[]

    // specific seeder(s) requested?
    if (args.seed) {
      // yes, parse and attempt to import
      seeders = seedingSource.seedersFromString(args.seed)
      spinner.info(`Specific seeder(s) have been requested`)
    } else {
      // no, fall back to defaults
      seeders = seedingSource.defaultSeeders
      spinner.info(`Default seeders will used`)
    }

    // here we go
    const seedersNames = seeders.map((seeder) => seeder.name).join(', ')
    spinner.start(`Executing ${seedersNames} Seeders`)

    // run seeders
    try {
      await Seeding.run(seeders)
      spinner.succeed(`Seeders ${seedersNames} executed`)
    } catch (error) {
      panic(spinner, error, `Failed to run the ${seedersNames} seeders!`)
      return
    }

    console.log('👍 ', gray.underline(`Finished Seeding`))
  }
}

function panic(spinner: Ora, error: unknown, message: string) {
  const finalError = error instanceof Error ? error : new Error(String(error))
  const finalMessage = `${message} Orginal error was: ${finalError.message}`
  spinner.fail(finalMessage)
  console.error(finalMessage)
  exit(1, finalError)
}
