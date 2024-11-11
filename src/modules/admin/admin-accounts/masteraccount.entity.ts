import { AbstractEntity } from 'src/utils/abstract.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity({ schema: 'public' })
export class MasterAccount extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({
    nullable: false,
    default: 'PENDING',
    enum: ['PENDING', 'ACTIVE', 'INACTIVE'],
  })
  status: string;

  @BeforeInsert()
  accountName() {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
