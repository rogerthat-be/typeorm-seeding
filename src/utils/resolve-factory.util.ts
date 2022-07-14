import { FactoriesConfiguration, FactoryInstanceOrClass } from '../types'

import { Factory } from '../factory'
import { SeedingSource } from '../seeding-source'

/**
 * Resolve Factory class or type and return Factory instance for given configuration key.
 *
 * @param key factory configuration key
 * @param factories factories default config
 * @param factoryOverrides factory overrides config
 */
export function resolveFactory<Entities, K extends keyof FactoriesConfiguration<Entities>>(
  seedingSource: SeedingSource,
  key: K,
  factories: FactoriesConfiguration<Entities> = {},
  factoryOverrides: FactoriesConfiguration<Entities> = {},
): Factory<Entities[K]> {
  // merge overrides on top of defaults
  const mergedFactories: FactoriesConfiguration<Entities> = { ...factories, ...factoryOverrides }

  // try to get the factory for given key
  const factory: FactoryInstanceOrClass<Entities[K]> | undefined = mergedFactories[key] ?? undefined

  if (factory !== undefined) {
    // the factory we will return
    const factoryToReturn = factory instanceof Factory ? factory : new factory()
    // set the seeding source
    factoryToReturn.seedingSource = seedingSource
    // return it
    return factoryToReturn
  }

  // factory for given key was not found
  throw new Error(`Factory for ${String(key)} is not configured`)
}
