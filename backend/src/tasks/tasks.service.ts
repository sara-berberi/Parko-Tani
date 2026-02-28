import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  @Cron('*/1 * * * *')
  async handleReservationExpiry() {
    const expiredCount = await this.reservationsService.expireExpired();
    if (expiredCount > 0) {
      this.logger.log(`Expired ${expiredCount} reservations`);
    }
  }
}
