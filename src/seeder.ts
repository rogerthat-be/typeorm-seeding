import type { ClassConstructor } from './types'
import type { DataSource } from 'typeorm'

export abstract class Seeder {
  abstract run(dataSource: DataSource): Promise<void>

  protected async call(dataSource: DataSource, seeders: ClassConstructor<Seeder>[]): Promise<void> {
    for (const seeder of seeders) {
      await new seeder().run(dataSource)
    }
  }
}
