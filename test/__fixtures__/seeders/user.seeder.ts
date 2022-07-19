import { PetSeeder } from './pet.seeder'
import { Seeder } from '../../../src/seeder'
import { SeederOptions } from '../../../src/types'
import { UserFactory } from '../factories/user.factory'

export class UserSeeder extends Seeder {
  protected options: SeederOptions = {
    seeders: [PetSeeder],
  }

  async run() {
    const userFactory = this.factory(UserFactory)
    await userFactory.createMany(10)
    await this.call()
    return
  }
}
