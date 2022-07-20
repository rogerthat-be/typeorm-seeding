import type { DataSource, DataSourceOptions } from 'typeorm'

import { Factory } from './factory'
import { Seeder } from './seeder'
import { SeedingSource } from './seeding-source'

export type ClassConstructor<T> = new (...args: any[]) => T

export type InstanceOrClass<T = any> = T | ClassConstructor<T>

export type ExtractFactory<F> = F extends Factory<infer E> ? F : never

export type FactoryInstanceOrClass<T> = InstanceOrClass<Factory<T>>

export type SeederInstanceOrClass = InstanceOrClass<Seeder>

export interface SeederOptions {
  seeders?: SeederInstanceOrClass[]
}

export interface SeederOptionsOverrides<SF = any> {
  seeders?: SeederInstanceOrClass[]
  factories?: ExtractFactory<SF>[]
  seedingSource?: SeedingSource
}

export interface FactoryOptions<T> {
  entity?: ClassConstructor<T>
  override?: ClassConstructor<Factory<any>>
}

export interface FactoryOptionsOverrides<T, SF = any> {
  entity?: ClassConstructor<T>
  factories?: ExtractFactory<SF>[]
  seedingSource?: SeedingSource
  override?: ClassConstructor<Factory<any>>
}

export interface SeedingSourceOptions {
  dataSource: DataSource | DataSourceOptions
  seeders?: ClassConstructor<Seeder>[]
  defaultSeeders?: ClassConstructor<Seeder>[]
}
