import type { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm'

import { Factory } from './factory'
import { Seeder } from './seeder'
import { SeedingSource } from './configuration/seeding-source'

export type ClassConstructor<T> = new () => T

export type SeedingSourceOptions = {
  seeders: ClassConstructor<Seeder>[]
  defaultSeeders: ClassConstructor<Seeder>[]
}

export type SeedingConfig = {
  root?: string
  dataSource?: DataSource
  dataSourceOptions?: DataSourceOptions
  dataSourceFile?: string
  seedingSource?: SeedingSource
  seedingSourceOptions?: SeedingSourceOptions
  seedingSourceFile?: string
}

export type SeederInstanceOrClass = Seeder | ClassConstructor<Seeder>

export type FactoryInstanceOrClass<T> = Factory<T> | ClassConstructor<Factory<T>>

export type FactoriesConfiguration<T extends ObjectLiteral = ObjectLiteral> = {
  [K in keyof T]?: FactoryInstanceOrClass<T[K]>
}
