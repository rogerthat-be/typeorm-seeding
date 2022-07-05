import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User2 } from './User2.entity'

@Entity()
export class Pet2 {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User2)
  @JoinColumn({ name: 'user_id' })
  owner!: User2
}
