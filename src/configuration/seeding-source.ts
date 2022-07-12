import { ClassConstructor, SeedingSourceOptions } from '../types'

import { Seeder } from '../seeder'
import { SeederImportException } from '../exceptions/seeder-import.exception'

export class SeedingSource {
  constructor(private options: SeedingSourceOptions) {}

  get seeders(): ClassConstructor<Seeder>[] {
    return this.options.seeders
  }

  get defaultSeeders(): ClassConstructor<Seeder>[] {
    return this.options.defaultSeeders
  }

  seedersFromString(seederNameString = ''): ClassConstructor<Seeder>[] {
    // resolve the seeders
    return this.resolveSeeders(seederNameString)
  }

  private parseSeederNames(seederNames: string): string[] {
    return seederNames.length ? seederNames.split(',').map((seederName) => seederName.trim()) : []
  }

  private resolveSeeder(seederClassName: string): ClassConstructor<Seeder> {
    // try to find in seeders option
    const seeder = this.options.seeders.find((seeder) => seeder.name === seederClassName)
    // find one?
    if (seeder) {
      // yes, return it
      return seeder
    } else {
      // not good :(
      throw new SeederImportException(
        `Seeder class ${seederClassName} was not found in "seeders" configuration property`,
      )
    }
  }

  private resolveSeeders(seederClassNames: string): ClassConstructor<Seeder>[] {
    // parse the names
    const seederNames = this.parseSeederNames(seederClassNames)
    // try to resolve each one by name
    return seederNames.map((seederName) => {
      return this.resolveSeeder(seederName)
    })
  }
}
