import { User } from '@dari/types';

export type SanitizedUser = Omit<User, 'password' | 'createdAt' | 'updatedAt'>;
