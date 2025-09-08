import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Author } from "src/authors/entities/author.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum Language{
    Persian = 'Persian',
    English ='English',
    Arabic ='Arabic'
}

export enum Genre{
    Action ='Action',
    Romance ='Romance',
    Comedy ='Comedy',
    Adventure ='Adventure',
    Horror ='Horror',
    Fantasy ='Fantasy',
    Historical ='Historical',
    Crime = 'Crime'
}
registerEnumType(Language , {name :" Language"})

registerEnumType(Genre , { name : "Genre"})


@ObjectType()
@Entity()
export class Book {

  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable : true})
  @ManyToOne(() => Author, (author) => author.books  ,{nullable:true ,
    cascade:true,
    onDelete:'CASCADE'
  })
  @JoinColumn()
  author?: Author; // ✅ فقط یک نویسنده

  @Field({nullable : true})
  @Column({ nullable: true })
  translator: string;

  @Field()
  @Column()
  edition: number;

  @Field()
  @Column()
  publisher: string;

  @Field(() => Language)
  @Column({
    type: 'enum',
    enum: Language,
    default: Language.Persian
  })
  language: Language;

  @Field(() => Genre)
  @Column({
    type: 'enum',
    enum: Genre
  })
  genre: Genre;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int ,{nullable : true})
  @Column({nullable:true})
  authorId: number; // ✅ درست و توصیه‌شده

}

