import { service } from '@/service/mod.ts';

@service()
export class UserService {
  name: string | null = 'UserService';
  key: string = 'user';
}
