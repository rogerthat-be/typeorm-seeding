import type { DataSource, DataSourceOptions } from 'typeorm'

export type ClassConstructor<T> = new () => T

export type SeederOptions = {
  seeders?: string[]
  defaultSeeder?: string
}

export type DataSourceConfiguration = {
  root?: string
  dataSource?: DataSource
  dataSourceOptions?: DataSourceOptions
  dataSourceConfig?: string
  seederConfig?: string
}
