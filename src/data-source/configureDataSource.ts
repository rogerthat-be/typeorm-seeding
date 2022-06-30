import type { DataSourceConfiguration } from '../types'
import { DataSourceConfigurationManager } from './DataSourceConfigurationManager'

export function configureDataSource(options: Partial<DataSourceConfiguration> = {}) {
  DataSourceConfigurationManager.getInstance().overrideConfiguration(options)
}
