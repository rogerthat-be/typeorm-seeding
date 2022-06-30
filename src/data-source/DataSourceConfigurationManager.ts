import type { DataSourceConfiguration } from '../types'

export class DataSourceConfigurationManager {
  private static _instance: DataSourceConfigurationManager | null
  private _configuration: Partial<DataSourceConfiguration> = {}

  static getInstance() {
    if (!DataSourceConfigurationManager._instance) {
      DataSourceConfigurationManager._instance = new DataSourceConfigurationManager()
    }

    return DataSourceConfigurationManager._instance
  }

  get configuration(): DataSourceConfiguration {
    return { root: '', seederConfig: 'seeding.ts', dataSourceConfig: 'ormconfig.ts', ...this._configuration }
  }

  overrideConfiguration(configuration: Partial<DataSourceConfiguration>) {
    this._configuration = { ...this._configuration, ...configuration }
  }

  replaceConfiguration(configuration: Partial<DataSourceConfiguration>) {
    this._configuration = configuration
  }
}
