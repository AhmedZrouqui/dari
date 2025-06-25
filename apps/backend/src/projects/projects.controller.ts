import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SanitizedUser } from '../common/types/user.types';
import { Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UpdateProjectDto } from './dto/update-project.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: SanitizedUser,
  ) {
    console.log(user);
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: SanitizedUser) {
    return this.projectsService.findAllForUser(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.projectsService.findOneById(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.projectsService.update(id, updateProjectDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: SanitizedUser,
  ) {
    return this.projectsService.remove(id, user);
  }
}
