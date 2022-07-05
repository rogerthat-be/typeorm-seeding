import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User2 {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string
}
