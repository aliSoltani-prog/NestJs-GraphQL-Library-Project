import { Field, Int, ObjectType } from "@nestjs/graphql"
import { User } from "src/users/entities/user.entity"
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@ObjectType()
@Entity()
export class Profile {
  
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id : number

    @Field()
    @Column()
    firstname : string

    @Field()
    @Column()
    lastname : string

    @Field()
    @Column({unique : true})
    phoneNumber : string

    @Field(() => Date)
    @Column()
    dateOfbirth : Date

    @Field(() => User , {nullable : true})
    @OneToOne(()=> User , (user)=>user.profile)
    user? : User

    @Field(() => Date)
    @CreateDateColumn()
    createdAt : Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt : Date


}
