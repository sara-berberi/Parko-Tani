import { IsString } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  token!: string;

  @IsString()
  platform!: string;
}
