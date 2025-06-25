import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SanitizedUser } from '../common/types/user.types';

@UseGuards(JwtAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @CurrentUser() developer: SanitizedUser,
  ) {
    return this.investmentsService.create(createInvestmentDto, developer);
  }

  @Get()
  findAllForProject(
    @Query('projectId', ParseUUIDPipe) projectId: string,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.investmentsService.findAllForProject(projectId, user);
  }
}
