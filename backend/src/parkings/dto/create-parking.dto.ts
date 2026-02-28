import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateParkingDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lon!: number;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsInt()
  @Min(1)
  totalSpots!: number;

  @IsInt()
  @Min(0)
  availableSpots!: number;
}
