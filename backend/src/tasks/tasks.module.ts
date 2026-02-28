import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  providers: [TasksService],
})
export class TasksModule {}
