import * as bcrypt from 'bcryptjs';
import { AbstractEntity } from 'src/utils/abstract.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class User extends AbstractEntity {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true, unique: true, select: false })
  refresh_token: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true, enum: ['PENDING', 'ACTIVE', 'INACTIVE'] })
  status: string;

  @BeforeInsert()
  async beforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
