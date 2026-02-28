import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection() {
    // connection established
  }

  handleDisconnect() {
    // connection closed
  }

  emitParkingUpdate(payload: any) {
    this.server.emit('parking.update', payload);
  }

  emitReservationUpdate(payload: any) {
    this.server.emit('reservation.update', payload);
  }
}
