import { ClassConstructor, FactoriesConfiguration } from './types'
import { ObjectLiteral, SaveOptions } from 'typeorm'

import { fetchDataSource } from './configuration/fetch-data-source'
import { isPromiseLike } from './utils/is-promise-like.util'
import { resolveFactory } from './utils/resolve-factory.util'

export interface FactoryOptions<T, Entities> {
  entity?: ClassConstructor<T>
  subFactories?: FactoriesConfiguration<Entities>
}

/**
 * Factory
 */
export abstract class Factory<Entity, Entities extends ObjectLiteral = ObjectLiteral> {
  /**
   * Options
   */
  protected options: FactoryOptions<Entity, Entities> = {}

  /**
   * Mapping function.
   *
   * @private
   */
  private mapFunction?: (entity: Entity) => Promise<void> | void

  /**
   * Constructor
   *
   * @param overrides option overrides
   */
  constructor(protected overrides: Partial<FactoryOptions<Entity, Entities>> = {}) {}

  /**
   * Return an instance of entity.
   *
   * @param entity An instance of the configured entity (if provided in options)
   */
  protected async entity(entity?: Entity): Promise<Entity> {
    if (entity) {
      return entity
    } else {
      throw new Error('No entity was found in Factory options, so you must override the `entity` method')
    }
  }

  /**
   * This function is used to alter the generated values of entity,
   * before it is persisted to the database.
   */
  map(mapFunction: (entity: Entity) => Promise<void> | void) {
    this.mapFunction = mapFunction
    return this
  }

  /**
   * Make a new entity without persisting it
   */
  async make(overrideParams: Partial<Entity> = {}): Promise<Entity> {
    return this.makeEntity(overrideParams, false)
  }

  /**
   * Make many new entities without persisting it
   */
  async makeMany(amount: number, overrideParams: Partial<Entity> = {}): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.make(overrideParams)
    }
    return list
  }

  /**
   * Create a new entity and persist it
   */
  async create(overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity> {
    const entity = await this.makeEntity(overrideParams, true)

    const dataSource = await fetchDataSource()
    return dataSource.createEntityManager().save<Entity>(entity, saveOptions)
  }

  /**
   * Create many new entities and persist them
   */
  async createMany(amount: number, overrideParams: Partial<Entity> = {}, saveOptions?: SaveOptions): Promise<Entity[]> {
    const list = []
    for (let index = 0; index < amount; index++) {
      list[index] = await this.create(overrideParams, saveOptions)
    }
    return list
  }

  private entityClass(): ClassConstructor<Entity> | undefined {
    return this.overrides?.entity ? this.overrides.entity : this.options.entity
  }

  private async makeEntity(overrideParams: Partial<Entity>, isSeeding: boolean) {
    const entityClass = this.entityClass()

    const entity = await this.entity(entityClass ? new entityClass() : undefined)

    if (this.mapFunction) {
      await this.mapFunction(entity)
    }

    for (const key in overrideParams) {
      const actualValue = entity[key]
      entity[key] = overrideParams[key] as typeof actualValue
    }

    return this.resolveEntity(entity, isSeeding)
  }

  private async resolveEntity(entity: Entity, isSeeding: boolean): Promise<Entity> {
    for (const attribute in entity) {
      const attributeValue = entity[attribute]

      if (isPromiseLike(attributeValue)) {
        entity[attribute] = await attributeValue
      }

      if (attributeValue instanceof Factory) {
        if (isSeeding) {
          entity[attribute] = await attributeValue.create()
        } else {
          entity[attribute] = await attributeValue.make()
        }
      }
    }
    return entity
  }

  /**
   * Return an instance of the sub factory for the given key.
   *
   * @param key key of factory to return
   */
  public subFactory<K extends keyof FactoriesConfiguration<Entities>>(key: K): Factory<Entities[K]> {
    return resolveFactory(key, this.options.subFactories, this.overrides.subFactories)
  }
}
