import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Request() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  updateProfile(@Request() req: any, @Body() body: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Post('device-token')
  registerDevice(@Request() req: any, @Body() body: RegisterDeviceDto) {
    return this.usersService.upsertDeviceToken(req.user.userId, body.token, body.platform);
  }
}
