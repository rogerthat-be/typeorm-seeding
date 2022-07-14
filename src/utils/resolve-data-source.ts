import { DataSource, DataSourceOptions } from 'typeorm'

export const resolveDataSource = (dataSource: DataSource | DataSourceOptions): DataSource => {
  // create new instance if necessary
  const dataSourceToReturn = dataSource instanceof DataSource ? dataSource : new DataSource(dataSource)
  // return the data source
  return dataSourceToReturn
}
