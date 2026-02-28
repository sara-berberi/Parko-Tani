import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { Role } from '../common/roles.enum';
import { Parking } from '@prisma/client';

@Injectable()
export class ParkingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateParkingDto, ownerId: string) {
    if (dto.availableSpots > dto.totalSpots) {
      throw new BadRequestException('Available spots cannot exceed total');
    }
    return this.prisma.parking.create({ data: { ...dto, ownerId } });
  }

  async update(id: string, data: Partial<CreateParkingDto>, ownerId: string, role: Role) {
    const parking = await this.prisma.parking.findUnique({ where: { id } });
    if (!parking) throw new NotFoundException('Parking not found');
    if (role !== Role.OWNER || parking.ownerId !== ownerId) {
      throw new BadRequestException('Not allowed');
    }
    if (
      data.availableSpots !== undefined &&
      data.totalSpots !== undefined &&
      data.availableSpots > data.totalSpots
    ) {
      throw new BadRequestException('Available cannot exceed total');
    }
    return this.prisma.parking.update({ where: { id }, data });
  }

  async findNearby(lat: number, lon: number, radiusKm = 2) {
    const parkings = await this.prisma.parking.findMany();
    // naive filter by haversine distance
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;
    return parkings
      .map((p: Parking) => {
        const dLat = toRad(Number(p.lat) - lat);
        const dLon = toRad(Number(p.lon) - lon);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat)) *
            Math.cos(toRad(Number(p.lat))) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        return { ...p, distanceKm: dist };
      })
      .filter((p: Parking & { distanceKm: number }) => p.distanceKm <= radiusKm)
      .sort((a: Parking & { distanceKm: number }, b: Parking & { distanceKm: number }) => a.distanceKm - b.distanceKm);
  }

  async findById(id: string) {
    const parking = await this.prisma.parking.findUnique({ where: { id } });
    if (!parking) throw new NotFoundException('Parking not found');
    return parking;
  }
}
