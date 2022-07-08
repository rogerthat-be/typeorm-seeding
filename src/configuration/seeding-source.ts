import { ClassConstructor, SeedingSourceOptions } from '../types'

import { Seeder } from '../seeder'
import { calculateFilePaths } from '../utils/calcuate-file-paths.util'

export class SeedingSource {
  constructor(private options: SeedingSourceOptions) {}

  get seeders(): string[] {
    return process.env.TYPEORM_SEEDING_SEEDERS ? [process.env.TYPEORM_SEEDING_SEEDERS] : this.options?.seeders ?? []
  }

  get defaultSeeder(): string {
    return process.env.TYPEORM_SEEDING_DEFAULT_SEEDER ?? this.options.defaultSeeder ?? ''
  }

  async resolveSeeders(): Promise<Record<string, ClassConstructor<Seeder>>> {
    const seederFiles = calculateFilePaths(this.seeders ?? [])
    const seedersImported = await Promise.all(seederFiles.map((seederFile) => import(seederFile)))
    const allSeeders = seedersImported.reduce((prev, curr) => Object.assign(prev, curr), {})
    return allSeeders
  }
}
