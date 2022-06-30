import type { ClassConstructor, DataSourceConfiguration } from './types'
import { configureDataSource, fetchDataSource } from './data-source'

import { Seeder } from './seeder'

export async function useSeeders(
  entrySeeders: ClassConstructor<Seeder> | ClassConstructor<Seeder>[],
  customOptions?: Partial<DataSourceConfiguration>,
): Promise<void> {
  if (customOptions) configureDataSource(customOptions)

  const dataSource = await fetchDataSource()

  const seeders = Array.isArray(entrySeeders) ? entrySeeders : [entrySeeders]

  for (const seeder of seeders) {
    await new seeder().run(dataSource)
  }
}
