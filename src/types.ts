import type { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm'

import { Factory } from './factory'
import { Seeder } from './seeder'
import { SeedingSource } from './seeding-source'

export type ClassConstructor<T> = new () => T

export interface SeederConstructor {
  new (overrides?: Partial<SeederOptions>): Seeder
}

export type SeederInstanceOrClass = Seeder | SeederConstructor

export interface SeederOptions<Entities extends ObjectLiteral = ObjectLiteral> {
  seedingSource?: SeedingSource
  factories?: FactoriesConfiguration<Entities>
  seeders?: SeederInstanceOrClass[]
}

export interface FactoryOptions<T, Entities extends ObjectLiteral> {
  seedingSource?: SeedingSource
  entity?: ClassConstructor<T>
  subFactories?: FactoriesConfiguration<Entities>
}

export type FactoryInstanceOrClass<T> = Factory<T> | ClassConstructor<Factory<T>>

export type FactoriesConfiguration<T extends ObjectLiteral = ObjectLiteral> = {
  [K in keyof T]?: FactoryInstanceOrClass<T[K]>
}

export type SeedingSourceOptions = {
  dataSource: DataSource | DataSourceOptions
  seeders: ClassConstructor<Seeder>[]
  defaultSeeders: ClassConstructor<Seeder>[]
}
