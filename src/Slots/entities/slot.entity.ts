import { Doctor } from '../../Doctors/entities/doctor.entity';
import { SlotStatus } from '../../Common/Enums/slot-status.enum';

export class Slot {
    id: string;
    doctor: Doctor;
    startTime: Date;
    endTime: Date;
    status: SlotStatus;

    constructor(id: string, doctor: Doctor, startTime: Date, endTime: Date) {
        this.id = id;
        this.doctor = doctor;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = SlotStatus.AVAILABLE;
    }

    getDuration(): number {
        return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60); // Duration in minutes
    }

    getFormattedTimeRange(): string {
        const formatTime = (date: Date) => {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        };
        return `${formatTime(this.startTime)}-${formatTime(this.endTime)}`;
    }
}