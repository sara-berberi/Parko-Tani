import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UsersModule } from '../users/users.module';
import { ParkingsModule } from '../parkings/parkings.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [UsersModule, ParkingsModule, RealtimeModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
