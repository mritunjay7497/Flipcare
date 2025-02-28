import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class BookAppointmentDto {
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @IsString()
    @IsNotEmpty()
    startTime: string; // Format: "HH:MM" (e.g., "09:30")
}