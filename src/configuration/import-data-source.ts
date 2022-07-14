import { DataSource } from 'typeorm'

export const importDataSource = async (file: string, root?: string): Promise<DataSource> => {
  // the data source we will be returning
  let dataSource: DataSource

  // first we need to import it
  const path = `${root ?? __dirname}/${file}`

  // import the configuration
  const config = await import(path)

  // use default or entire module?
  if (config?.default) {
    dataSource = config.default
  } else if (config) {
    dataSource = config
  } else {
    throw new Error(
      `The data source config file ${path} does not contain an export (must be a valid DataSource instance)`,
    )
  }

  // return the data source
  return dataSource
}
