import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class RegisterPatientDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}