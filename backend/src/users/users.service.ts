import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async upsertDeviceToken(userId: string, token: string, platform: string) {
    await this.prisma.deviceToken.upsert({
      where: { token },
      create: { token, platform, userId },
      update: { platform, userId, lastSeenAt: new Date() },
    });
  }

  async updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }
}
