import { ConfigManager } from './config-manager'
import { SeedingConfig } from '../types'

export function configure(options: Partial<SeedingConfig> = {}) {
  ConfigManager.getInstance().overrideConfig(options)
}
