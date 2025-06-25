import { SanitizedUser } from '../../common/types/user.types';

export interface ILoginResponse {
  accessToken: string;
  user: SanitizedUser;
}
