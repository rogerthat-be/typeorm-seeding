import { ConfigManager } from './config-manager'
import { SeedingCommandConfig } from '../types'

export async function getSeedingCommandConfig(): Promise<SeedingCommandConfig> {
  const { root, seedingConfig } = ConfigManager.getInstance().configuration

  if (!seedingConfig) {
    throw new Error('No seeder config file path was given')
  }

  const configPath = `${root}/${seedingConfig}`
  const options: SeedingCommandConfig = await import(configPath)

  const seedersFromEnv = process.env.TYPEORM_SEEDING_SEEDERS
  const defaultSeederFromEnv = process.env.TYPEORM_SEEDING_DEFAULT_SEEDER
  const defaultSeeder = defaultSeederFromEnv ?? options?.defaultSeeder

  return {
    ...options,
    seeders: seedersFromEnv ? [seedersFromEnv] : options?.seeders ?? [],
    defaultSeeder,
  }
}
