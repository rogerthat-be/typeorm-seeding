import { Factory } from '../../src/factory'
import { User } from '../entities/User.entity'
import { faker } from '@faker-js/faker'

export class UserFactory extends Factory<User> {
  protected async definition(): Promise<User> {
    const user = new User()

    user.name = faker.name.findName()

    return user
  }
}
