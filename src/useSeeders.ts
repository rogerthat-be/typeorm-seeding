import type { DataSourceConfiguration, SeederTypeOrClass } from './types'
import { configureDataSource, fetchDataSource } from './data-source'

import { Seeder } from './seeder'

export async function useSeeders(
  entrySeeders: SeederTypeOrClass | SeederTypeOrClass[],
  customOptions?: Partial<DataSourceConfiguration>,
): Promise<void> {
  if (customOptions) configureDataSource(customOptions)

  const dataSource = await fetchDataSource()

  const seeders = Array.isArray(entrySeeders) ? entrySeeders : [entrySeeders]

  for (const seeder of seeders) {
    if (seeder instanceof Seeder) {
      await seeder.run(dataSource)
    } else {
      await new seeder().run(dataSource)
    }
  }
}
