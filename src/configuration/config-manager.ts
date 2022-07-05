import { SeedingConfig } from '../types'

export class ConfigManager {
  private static _instance: ConfigManager | null
  private config: Partial<SeedingConfig> = {}

  static getInstance() {
    if (!ConfigManager._instance) {
      ConfigManager._instance = new ConfigManager()
    }

    return ConfigManager._instance
  }

  get configuration(): SeedingConfig {
    return { root: '', seedingConfig: 'seeding.ts', dataSourceConfig: 'ormconfig.ts', ...this.config }
  }

  overrideConfig(config: Partial<SeedingConfig>) {
    this.config = { ...this.config, ...config }
  }

  replaceConfig(configuration: Partial<SeedingConfig>) {
    this.config = configuration
  }
}
