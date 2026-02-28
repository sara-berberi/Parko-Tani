import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto, req.user.userId);
  }

  @Patch(':id/cancel')
  cancel(@Request() req: any, @Param('id') id: string) {
    return this.reservationsService.cancel(id, req.user.userId);
  }

  @Get('me')
  mine(@Request() req: any) {
    return this.reservationsService.findMine(req.user.userId);
  }
}
