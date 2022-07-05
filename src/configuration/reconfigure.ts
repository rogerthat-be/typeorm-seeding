import { ConfigManager } from './config-manager'
import { SeedingConfig } from '../types'

export function reconfigure(options: Partial<SeedingConfig> = {}) {
  ConfigManager.getInstance().replaceConfig(options)
}
