import { Factory } from '../../../src/factory'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'
import { UserFactory } from './user.factory'
import { faker } from '@faker-js/faker'

export class PetFactory extends Factory<Pet, { user: User }> {
  protected options = { entity: Pet, subFactories: { user: new UserFactory() } }

  protected async entity(pet: Pet): Promise<Pet> {
    pet.name = faker.name.findName()
    return pet
  }

  protected async finalize(pet: Pet): Promise<void> {
    if (!pet.owner) {
      pet.owner = await this.subFactory('user').create()
    }
  }
}
