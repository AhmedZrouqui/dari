import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectUpdatesService } from './project-updates.service';
import { CreateProjectUpdateDto } from './dto/create-update.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SanitizedUser } from 'src/common/types/user.types';

@UseGuards(JwtAuthGuard)
@Controller('updates')
export class ProjectUpdatesController {
  constructor(private readonly updatesService: ProjectUpdatesService) {}

  @Post()
  create(
    @Body() createDto: CreateProjectUpdateDto,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.updatesService.create(createDto, user);
  }

  @Get()
  findAllForProject(
    @Query('projectId', ParseUUIDPipe) projectId: string,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.updatesService.findAllForProject(projectId, user);
  }
}
