import { PetFactory } from '../factories/pet.factory'
import { Seeder } from '../../../src/seeder'
import { SeederOptions } from '../../../src/types'

export class PetSeeder extends Seeder {
  protected options: SeederOptions = {}

  async run() {
    const petFactory = this.factory(PetFactory)
    await petFactory.createMany(10)
  }
}
