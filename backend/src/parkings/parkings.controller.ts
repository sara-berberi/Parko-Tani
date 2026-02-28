import { Body, Controller, Get, Patch, Post, Query, Request, UseGuards, Param } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/roles.enum';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';

@Controller('parkings')
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  create(@Request() req: any, @Body() dto: CreateParkingDto) {
    return this.parkingsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateParkingDto) {
    return this.parkingsService.update(id, dto, req.user.userId, req.user.role as Role);
  }

  @Get()
  listNearby(@Query('lat') lat?: string, @Query('lon') lon?: string, @Query('radius') radius?: string) {
    if (!lat || !lon) return this.parkingsService.findNearby(0, 0, 2); // fallback minimal
    return this.parkingsService.findNearby(parseFloat(lat), parseFloat(lon), radius ? parseFloat(radius) : 2);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.parkingsService.findById(id);
  }
}
