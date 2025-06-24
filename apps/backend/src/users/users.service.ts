import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@dari/types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
}
