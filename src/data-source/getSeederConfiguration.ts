import { DataSourceConfigurationManager } from './DataSourceConfigurationManager'
import { SeederConfiguration } from '../types'

export async function getSeederConfiguration(): Promise<SeederConfiguration> {
  const { root, seederConfig } = DataSourceConfigurationManager.getInstance().configuration

  if (!seederConfig) {
    throw new Error('No seeder config file path was given')
  }

  const configPath = `${root}/${seederConfig}`
  const options: SeederConfiguration = await import(configPath)

  const seedersFromEnv = process.env.TYPEORM_SEEDING_SEEDERS
  const defaultSeederFromEnv = process.env.TYPEORM_SEEDING_DEFAULT_SEEDER
  const defaultSeeder = defaultSeederFromEnv ?? options?.defaultSeeder

  return {
    ...options,
    seeders: seedersFromEnv ? [seedersFromEnv] : options?.seeders ?? [],
    defaultSeeder,
  }
}
