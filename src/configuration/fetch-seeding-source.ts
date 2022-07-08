import { ConfigManager } from './config-manager'
import { Seeding } from '../seeding'
import { SeedingSource } from './seeding-source'

export async function fetchSeedingSource(): Promise<SeedingSource> {
  const { root, seedingSource, seedingSourceOptions, seedingSourceFile } = ConfigManager.getInstance().configuration

  // the seeding source we will be returning
  let seedingSourceToReturn: SeedingSource

  // was seeding source explicitly set?
  if (seedingSource) {
    // yes, use it!
    seedingSourceToReturn = seedingSource
  } else if (seedingSourceOptions) {
    // received explicit seeding source options
    seedingSourceToReturn = new SeedingSource(seedingSourceOptions)
  } else if (seedingSourceFile) {
    // first we need to import it
    const path = `${root}/${seedingSourceFile}`
    // import the configuration
    const config = await import(path)
    // make sure it's valid
    if (config.default instanceof SeedingSource) {
      seedingSourceToReturn = config.default
    } else if (config instanceof SeedingSource) {
      seedingSourceToReturn = config
    } else {
      throw new Error(
        `The seeding source config file ${path} does not contain an export of a valid SeedingSource instance`,
      )
    }
  } else {
    throw new Error('Unable to load seeding source, no configurations were found')
  }

  // set the datasource for future runs
  Seeding.configure({ seedingSource: seedingSourceToReturn })

  return seedingSourceToReturn
}
