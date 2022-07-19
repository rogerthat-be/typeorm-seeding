import { ClassConstructor, ExtractFactory } from '../types'

import { Factory } from '../factory'
import { SeedingSource } from '../seeding-source'

/**
 * Resolve Factory class or type and return Factory instance for given class.
 */
export function resolveFactory<Needle, Haystack>(
  factory: ClassConstructor<ExtractFactory<Needle>>,
  factoryOverrides: ExtractFactory<Haystack>[] = [],
  seedingSource: SeedingSource,
): ExtractFactory<Needle | Haystack> {
  // try to get the factory for given class
  const factoryOverridden: ExtractFactory<Haystack> | undefined = factoryOverrides.reverse().find((factoryOverride) => {
    if (factoryOverride instanceof Factory) {
      return factoryOverride.overrides === factory.prototype.constructor
    } else {
      return false
    }
  })

  // the factory we will return
  const factoryToReturn: ExtractFactory<Needle | Haystack> = factoryOverridden ? factoryOverridden : new factory()

  // set the seeding source
  factoryToReturn.seedingSource = seedingSource

  // return it
  return factoryToReturn
}
