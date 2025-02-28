import { IsArray, IsString } from '@nestjs/class-validator';

export class TimeSlot {
    @IsString()
    startTime: string;
    @IsString()
    endTime: string;
}

export class MarkAvailabilityDto {
    @IsString()
    doctorId: string;
    @IsArray()
    timeSlots: TimeSlot[];
}

