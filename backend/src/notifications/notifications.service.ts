import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly usersService: UsersService, private readonly realtime: RealtimeGateway) {}

  async notifyParkingAvailable(parkingId: string, message: string) {
    // placeholder: in real impl, look up device tokens and send push
    this.realtime.emitParkingUpdate({ parkingId, message });
    return { ok: true };
  }
}
