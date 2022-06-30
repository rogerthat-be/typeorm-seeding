import type { DataSource } from 'typeorm'
import { PetSeeder } from './Pet.seeder'
import { Seeder } from '../../src'
import { UserFactory } from '../factories/User.factory'

export class UserSeeder extends Seeder {
  async run(dataSource: DataSource) {
    await new UserFactory().createMany(10)

    await this.call(dataSource, [PetSeeder])
  }
}
