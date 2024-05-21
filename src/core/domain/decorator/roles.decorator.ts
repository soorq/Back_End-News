import { SetMetadata } from '@nestjs/common';
import type { Role } from '@/shared/roles';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
