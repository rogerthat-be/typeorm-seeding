import { Pet } from '../entities/Pet.entity'
import { PetFactory } from '../factories/pet.factory'
import { Seeder } from '../../../src/seeder'

type PetEntities = { pet: Pet }

export class PetSeeder extends Seeder<PetEntities> {
  protected options = {
    factories: {
      pet: new PetFactory(),
    },
  }

  async run() {
    const petFactory = this.factory('pet')
    await petFactory.createMany(10)
  }
}
