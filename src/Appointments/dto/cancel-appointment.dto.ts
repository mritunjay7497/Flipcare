import { IsNotEmpty, IsString } from '@nestjs/class-validator';

export class CancelAppointmentDto {
    @IsString()
    @IsNotEmpty()
    bookingId: string;
}