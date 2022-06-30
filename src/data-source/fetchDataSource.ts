import { DataSource } from 'typeorm'
import { DataSourceConfigurationManager } from './DataSourceConfigurationManager'
import { configureDataSource } from './configureDataSource'

export const fetchDataSource = async (): Promise<DataSource> => {
  const DSCM = DataSourceConfigurationManager.getInstance()

  const { root, dataSource, dataSourceConfig, dataSourceOptions } = DSCM.configuration

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
    const options = await import(path)
    // let's go
    dataSourceToReturn = new DataSource(options)
  } else {
    throw new Error('Unable to load data source, no configurations were found')
  }

  // set the datasource for future runs
  configureDataSource({ dataSource: dataSourceToReturn })

  // has been initialized yet?
  if (!dataSourceToReturn.isInitialized) {
    // no, initialize it
    await dataSourceToReturn.initialize()
  }

  // return the data source
  return dataSourceToReturn
}
