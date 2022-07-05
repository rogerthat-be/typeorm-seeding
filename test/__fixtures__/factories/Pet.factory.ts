import { Factory } from '../../../src/factory'
import { Pet } from '../entities/Pet.entity'
import { User } from '../entities/User.entity'
import { UserFactory } from './User.factory'
import { faker } from '@faker-js/faker'

export class PetFactory extends Factory<Pet, { user: User }> {
  protected options = { entity: Pet, factories: { user: new UserFactory() } }

  protected async entity(pet: Pet): Promise<Pet> {
    pet.name = faker.name.findName()
    pet.owner = await this.subFactory('user').create()

    return pet
  }
}
