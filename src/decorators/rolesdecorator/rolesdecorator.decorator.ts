import { SetMetadata } from '@nestjs/common';
import { Roles as UserRoles } from 'src/users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const RoleDeco = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
