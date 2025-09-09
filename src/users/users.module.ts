import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Profile , User])],
  providers: [UsersResolver, UsersService],
  exports : [UsersService]
})
export class UsersModule {}
