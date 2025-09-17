import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Profile } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User , Profile]), // Import User repository
  ],
  providers: [
    AuthService,
    AuthResolver,
    UsersService, // so AuthService can use it
  ],
  exports: [AuthService], // optional if other modules need AuthService
})
export class AuthModule {}
