import { Module, forwardRef } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { ParkingsModule } from "../parkings/parkings.module";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [ParkingsModule, forwardRef(() => RealtimeModule)],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
