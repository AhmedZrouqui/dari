import { SanitizedUser } from 'src/common/types/user.types';

export interface ILoginResponse {
  accessToken: string;
  user: SanitizedUser;
}
