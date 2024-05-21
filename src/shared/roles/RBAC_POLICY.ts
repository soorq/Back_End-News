import { RolesBuilder } from 'nest-access-control';
import { Role } from './roles.enum';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

RBAC_POLICY.grant(Role.GUEST)
  .grant(Role.USER)
  .extend(Role.GUEST)
  .readOwn(['post'])
  .grant(Role.CREATOR)
  .extend(Role.USER)
  .readAny(['post'])
  .createAny(['post'])
  .updateAny(['post'])
  .grant(Role.ADMIN)
  .extend(Role.CREATOR)
  .createAny(['user', 'post', 'category'])
  .updateAny(['user', 'post', 'category'])
  .deleteAny(['user', 'post', 'category']);
