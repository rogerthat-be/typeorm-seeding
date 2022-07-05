import { FactoriesConfiguration, FactoryTypeOrClass } from '../types'

import { Factory } from '../factory'

/**
 * Resolve Factory class or type and return Factory instance for given configuration key.
 *
 * @param key factory configuration key
 * @param factories factories default config
 * @param factoryOverrides factory overrides config
 */
export function resolveFactoryUtil<Entities, K extends keyof FactoriesConfiguration<Entities>>(
  key: K,
  factories: FactoriesConfiguration<Entities> = {},
  factoryOverrides: FactoriesConfiguration<Entities> = {},
): Factory<Entities[K]> {
  // merge overrides on top of defaults
  const mergedFactories: FactoriesConfiguration<Entities> = { ...factories, ...factoryOverrides }

  // try to get the factory for given key
  const factory: FactoryTypeOrClass<Entities[K]> | undefined = mergedFactories[key] ?? undefined

  // is already an instance?
  if (factory instanceof Factory) {
    // yes, return it
    return factory
  } else if (factory !== undefined) {
    // it's a class, return new instance
    return new factory()
  }

  // factory for given key was not found
  throw new Error(`Factory for ${String(key)} is not configured`)
}
