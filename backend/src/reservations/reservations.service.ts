import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { Prisma, PrismaClient } from "@prisma/client";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtime: RealtimeGateway,
  ) {}

  async create(dto: CreateReservationDto, userId: string) {
    const active = await this.prisma.reservation.findFirst({
      where: { userId, status: "ACTIVE" },
    });
    if (active)
      throw new BadRequestException("You already have an active reservation");

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const parking = await tx.parking.findUnique({
        where: { id: dto.parkingId },
      });
      if (!parking) throw new NotFoundException("Parking not found");
      if (parking.availableSpots <= 0)
        throw new BadRequestException("No spots available");

      const now = new Date();
      const expiresAt = new Date(now.getTime() + THIRTY_MINUTES_MS);

      const reservation = await tx.reservation.create({
        data: {
          userId,
          parkingId: dto.parkingId,
          status: "ACTIVE",
          startTime: now,
          expiresAt,
        },
      });

      await tx.parking.update({
        where: { id: dto.parkingId },
        data: { availableSpots: { decrement: 1 } },
      });

      this.realtime.emitReservationUpdate({
        id: reservation.id,
        status: reservation.status,
        expiresAt,
      });
      this.realtime.emitParkingUpdate({
        parkingId: parking.id,
        availableSpots: parking.availableSpots - 1,
      });

      return reservation;
    });
  }

  async cancel(id: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });
    if (!reservation || reservation.userId !== userId)
      throw new NotFoundException("Reservation not found");
    if (reservation.status !== "ACTIVE")
      throw new BadRequestException("Reservation not active");

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.reservation.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      await tx.parking.update({
        where: { id: reservation.parkingId },
        data: { availableSpots: { increment: 1 } },
      });

      this.realtime.emitReservationUpdate({
        id: updated.id,
        status: updated.status,
      });
      this.realtime.emitParkingUpdate({
        parkingId: reservation.parkingId,
        delta: +1,
      });

      return updated;
    });
  }

  async expireExpired() {
    const now = new Date();
    const expired = await this.prisma.reservation.findMany({
      where: { status: "ACTIVE", expiresAt: { lte: now } },
    });

    if (!expired.length) return 0;

    for (const r of expired) {
      // eslint-disable-next-line no-await-in-loop
      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.reservation.update({
          where: { id: r.id },
          data: { status: "EXPIRED" },
        });
        await tx.parking.update({
          where: { id: r.parkingId },
          data: { availableSpots: { increment: 1 } },
        });
      });

      this.realtime.emitReservationUpdate({ id: r.id, status: "EXPIRED" });
      this.realtime.emitParkingUpdate({ parkingId: r.parkingId, delta: +1 });
    }

    return expired.length;
  }

  async findMine(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
