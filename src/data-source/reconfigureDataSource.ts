import type { DataSourceConfiguration } from '../types'
import { DataSourceConfigurationManager } from './DataSourceConfigurationManager'

export function reconfigureDataSource(options: Partial<DataSourceConfiguration> = {}) {
  DataSourceConfigurationManager.getInstance().replaceConfiguration(options)
}
