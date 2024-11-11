import { AbstractEntity } from 'src/utils/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'account' })
export class Account extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  slug: string;
}
