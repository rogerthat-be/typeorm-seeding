import { SeedingSource } from '../seeding-source'

export async function importSeedingSource(file: string, root?: string): Promise<SeedingSource> {
  // the seeding source we will be returning
  let seedingSource: SeedingSource

  // first we need to import it
  const path = `${root ?? __dirname}/${file}`

  // import the configuration
  const config = await import(path)

  // make sure it's set
  if (config.default) {
    seedingSource = config.default
  } else if (config) {
    seedingSource = config
  } else {
    throw new Error(
      `The seeding source config file ${path} does not contain an export of a valid SeedingSource instance`,
    )
  }

  return seedingSource
}
