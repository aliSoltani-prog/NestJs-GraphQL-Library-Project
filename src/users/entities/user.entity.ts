
import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Roles {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest' // ✅ نه Geust
}

registerEnumType(Roles , {name: "Roles"})

@ObjectType()
@Entity()
export class User {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id : number

    @Field()
    @Column({unique:true})
    username : string

    @Field(() => Roles)
    @Column({
        type:'enum'
        , default:Roles.Guest
        , enum : Roles
    })
    role : Roles

    @Field()
    @Column({unique:true})
    email : string

    @Column()
    password : string

    @Field({nullable : true})
    @OneToOne(()=>Profile , (profile) => profile.user  , {
      cascade:true , 
      onDelete:'CASCADE'
    })
    @JoinColumn()
    profile?:Profile

    @Field(()=> Date)
    @CreateDateColumn()
    createdAt : Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt : Date
}
