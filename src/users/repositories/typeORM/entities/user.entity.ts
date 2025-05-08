import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  nickname: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @ManyToOne(() => Role, { nullable: false, eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
