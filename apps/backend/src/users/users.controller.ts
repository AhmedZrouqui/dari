import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SanitizedUser } from '../common/types/user.types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor() {}

  @Get('me')
  getMe(@CurrentUser() user: SanitizedUser) {
    return user;
  }
}
