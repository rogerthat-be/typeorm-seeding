import { Arguments, Argv, CommandModule, exit } from 'yargs'
import ora, { Ora } from 'ora'

import { ClassConstructor } from '../types'
import { Seeder } from '../seeder'
import { SeederImportException } from '../exceptions/seeder-import.exception'
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

    try {
      const rootPath = args.root && args.root[0] === '.' ? process.cwd() + '/' + args.root : args.root
      Seeding.configure({
        root: rootPath,
        dataSourceFile: args.dataSource,
        seedingSourceFile: args.seedingSource,
      })
      seedingSource = await fetchSeedingSource()
      spinner.succeed('ORM Config loaded')
    } catch (error) {
      panic(spinner, error as Error, 'Could not load the config file!')
      return
    }

    // Show seeder in console
    spinner.start('Importing Seeder')
    let seeder!: ClassConstructor<Seeder>

    try {
      if (seedingSource.seeders?.length) {
        const allSeeders = await seedingSource.resolveSeeders()

        let seederWanted = ''

        if (args.seed) {
          spinner.info(`Specific seeder ${args.seed} was requested`)
          seederWanted = args.seed
        } else if (seedingSource.defaultSeeder) {
          spinner.info(`Default seeder ${seedingSource.defaultSeeder} was requested`)
          seederWanted = seedingSource.defaultSeeder
        }

        // did we get a seeder?
        if (seederWanted) {
          // yes, does it exist in config
          if (allSeeders[seederWanted]) {
            // yes, set it
            seeder = allSeeders[seederWanted]
            // woot
            spinner.succeed(`Seeder ${seederWanted} found in config`)
          } else {
            // not good :(
            throw new SeederImportException(`Seeder ${seederWanted} was not found in "seeders" coniguration property`)
          }
        }
      } else {
        spinner.warn('Seeders configuration option `seeders` is missing or empty')
      }
    } catch (error) {
      panic(spinner, error as Error, 'Could not import seeders!')
      return
    }

    // Run seeder
    spinner.start(`Executing ${seeder.name} Seeder`)
    try {
      await Seeding.run([seeder])
      spinner.succeed(`Seeder ${seeder.name} executed`)
    } catch (error) {
      panic(spinner, error as Error, `Could not run the seed ${seeder.name}!`)
      return
    }

    console.log('👍 ', gray.underline(`Finished Seeding`))
  }
}

function panic(spinner: Ora, error: Error, message: string) {
  spinner.fail(message)
  console.error(error.message)
  exit(1, error)
}
