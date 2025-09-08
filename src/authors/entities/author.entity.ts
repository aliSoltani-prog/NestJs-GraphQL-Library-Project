import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Book } from "src/books/entities/book.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Author {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Date)
  @Column()
  dateOfBirth: Date;

  @Field({nullable : true})
  @Column({ nullable: true })
  nationality: string;

  @Field(() => [Book] , {nullable : true})
  @OneToMany(() => Book, (book) => book.author)
  books?: Book[]; // ✅ آرایه از کتاب‌ها

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
