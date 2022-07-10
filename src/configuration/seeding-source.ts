import { ClassConstructor, SeedingSourceOptions } from '../types'

import { Seeder } from '../seeder'
import { SeederImportException } from '../exceptions/seeder-import.exception'
import { calculateFilePaths } from '../utils/calcuate-file-paths.util'

export class SeedingSource {
  constructor(private options: SeedingSourceOptions) {}

  async seeders(only: string[] = []): Promise<ClassConstructor<Seeder>[]> {
    const seederConfig = process.env.TYPEORM_SEEDING_SEEDERS
      ? [process.env.TYPEORM_SEEDING_SEEDERS]
      : this.options?.seeders ?? []

    const seeders = await this.resolveSeeders(seederConfig)

    if (only.length) {
      // seeders we will return
      const seedersToReturn: ClassConstructor<Seeder>[] = []
      // loop all seeder names
      for (const seederName of only) {
        // exists in config?
        if (seeders[seederName]) {
          // push onto return array
          seedersToReturn.push(seeders[seederName])
        } else {
          // not good :(
          throw new SeederImportException(`Seeder ${seederName} was not found in "seeders" configuration property`)
        }
      }
      // return them
      return seedersToReturn
    } else {
      // return all
      return Object.values(seeders)
    }
  }

  async defaultSeeders(): Promise<ClassConstructor<Seeder>[]> {
    return await this.seeders(this.defaultSeederNames())
  }

  parseSeederNames(seederNames: string): string[] {
    return seederNames.length ? seederNames.split(',').map((seederName) => seederName.trim()) : []
  }

  defaultSeederNames(): string[] {
    const defaultSeeders = process.env.TYPEORM_SEEDING_DEFAULT_SEEDERS ?? this.options.defaultSeeders ?? ''
    return this.parseSeederNames(defaultSeeders)
  }

  private async resolveSeeders(seeders: string[] = []): Promise<Record<string, ClassConstructor<Seeder>>> {
    const seederFiles = calculateFilePaths(seeders)
    const seedersImported = await Promise.all(seederFiles.map((seederFile) => import(seederFile)))
    const allSeeders = seedersImported.reduce((prev, curr) => Object.assign(prev, curr), {})
    return allSeeders
  }
}
