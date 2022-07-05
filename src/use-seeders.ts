import { SeederTypeOrClass, SeedingConfig } from './types'

import { Seeder } from './seeder'
import { configure } from './configuration/configure'
import { fetchDataSource } from './configuration/fetch-data-source'

export async function useSeeders(
  entrySeeders: SeederTypeOrClass | SeederTypeOrClass[],
  customOptions?: Partial<SeedingConfig>,
): Promise<void> {
  if (customOptions) configure(customOptions)

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
