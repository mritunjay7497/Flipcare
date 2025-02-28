import { Injectable } from '@nestjs/common';
import { Slot } from './entities/slot.entity';
import { Doctor } from '../Doctors/entities/doctor.entity';
import { SlotStatus } from '../Common/Enums/slot-status.enum';
import { Speciality } from '../Common/Enums/speciality.enum';
import { v4 as uuidv4 } from 'uuid';
import { RankingService } from '../Common/Services/ranking.service';

@Injectable()
export class SlotsService {
    private slots: Map<string, Slot> = new Map();

    constructor(private readonly rankingService: RankingService) { }

    createSlot(doctor: Doctor, startTime: Date, endTime: Date): Slot {
        const id = uuidv4();
        const slot = new Slot(id, doctor, startTime, endTime);
        this.slots.set(id, slot);
        return slot;
    }

    findById(id: string): Slot | undefined {
        return this.slots.get(id);
    }

    findAvailableSlotsBySpeciality(speciality: Speciality): Slot[] {
        const availableSlots = Array.from(this.slots.values()).filter(
            (slot) =>
                slot.doctor.speciality === speciality &&
                slot.status === SlotStatus.AVAILABLE
        );

        // Use the ranking service to sort the slots
        return this.rankingService.rankSlots(availableSlots);
    }

    findAvailableSlotByDoctorAndTime(doctorId: string, startTime: Date): Slot | undefined {
        return Array.from(this.slots.values()).find(
            (slot) =>
                slot.doctor.id === doctorId &&
                slot.status === SlotStatus.AVAILABLE &&
                slot.startTime.getTime() === startTime.getTime()
        );
    }

    findSlotsByPatientId(patientId: string): Slot[] {
        // This would need to work with appointments service to find booked slots
        // This is a placeholder implementation
        return [];
    }

    updateSlotStatus(slotId: string, status: SlotStatus): boolean {
        const slot = this.findById(slotId);
        if (slot) {
            slot.status = status;
            return true;
        }
        return false;
    }

    getAllSlots(): Slot[] {
        return Array.from(this.slots.values());
    }
}
