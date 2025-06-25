import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SanitizedUser } from '../common/types/user.types';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@UseGuards(JwtAuthGuard)
@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  create(
    @Body() createMilestoneDto: CreateMilestoneDto,
    @CurrentUser() user: SanitizedUser,
  ) {
    // The service will handle creating the milestone for the specified projectId
    return this.milestonesService.create(createMilestoneDto, user);
  }

  @Get()
  findAllForProject(
    @Query('projectId', ParseUUIDPipe) projectId: string,
    @CurrentUser() user: SanitizedUser,
  ) {
    console.log('triggered', projectId, user);
    return this.milestonesService.findAllForProject(projectId, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.milestonesService.update(id, updateMilestoneDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.milestonesService.remove(id, user);
  }
}
