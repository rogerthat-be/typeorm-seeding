import type { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm'

import { Factory } from './factory'
import { Seeder } from './seeder'

export type ClassConstructor<T> = new () => T

export type SeederConfiguration = {
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

export type SeederTypeOrClass = Seeder | ClassConstructor<Seeder>

export type FactoryTypeOrClass<T> = Factory<T> | ClassConstructor<Factory<T>>

export type FactoriesConfiguration<T extends ObjectLiteral = ObjectLiteral> = {
  [K in keyof T]?: FactoryTypeOrClass<T[K]>
}
