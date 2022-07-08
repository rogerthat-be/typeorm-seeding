import { ConfigManager } from './config-manager'
import { DataSource } from 'typeorm'
import { Seeding } from '../seeding'

export const fetchDataSource = async (): Promise<DataSource> => {
  const { root, dataSource, dataSourceConfig, dataSourceOptions } = ConfigManager.getInstance().configuration

  // the data source we will be returning
  let dataSourceToReturn: DataSource

  // was datasource explicitly set?
  if (dataSource) {
    // yes, use it!
    dataSourceToReturn = dataSource
  } else if (dataSourceOptions) {
    // received explicit data source options
    dataSourceToReturn = new DataSource(dataSourceOptions)
  } else if (dataSourceConfig) {
    // first we need to import it
    const path = `${root}/${dataSourceConfig}`
    // import the configuration
    const config = await import(path)
    // make sure it's valid
    if (config.default instanceof DataSource) {
      dataSourceToReturn = config.default
    } else if (config instanceof DataSource) {
      dataSourceToReturn = config
    } else {
      throw new Error(`The data source config file ${path} does not contain an export of a valid DataSource instance`)
    }
  } else {
    throw new Error('Unable to load data source, no configurations were found')
  }

  // set the datasource for future runs
  Seeding.configure({ dataSource: dataSourceToReturn })

  // has been initialized yet?
  if (!dataSourceToReturn.isInitialized) {
    // no, initialize it
    await dataSourceToReturn.initialize()
  }

  // return the data source
  return dataSourceToReturn
}
