import { Module, forwardRef } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import { ReservationsModule } from "../reservations/reservations.module";

@Module({
  imports: [forwardRef(() => ReservationsModule)],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
