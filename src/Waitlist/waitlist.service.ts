import { Injectable } from '@nestjs/common';
import { WaitlistEntry } from './entities/waitlist-entry.entity';
import { Patient } from '../Patients/entities/patient.entity';
import { Doctor } from '../Doctors/entities/doctor.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WaitlistService {
    private waitlist: Map<string, WaitlistEntry> = new Map();

    addToWaitlist(
        patient: Patient,
        doctor: Doctor,
        timeSlot: { startTime: Date; endTime: Date },
    ): WaitlistEntry {
        const id = uuidv4();
        const entry = new WaitlistEntry(id, patient, doctor, timeSlot);
        this.waitlist.set(id, entry);
        return entry;
    }

    getNextInWaitlist(
        doctorId: string,
        timeSlot: { startTime: Date; endTime: Date },
    ): WaitlistEntry | undefined {
        // Find entries for this doctor and time slot, sorted by request time (FIFO)
        const entries = Array.from(this.waitlist.values())
            .filter(
                (entry) =>
                    entry.doctor.id === doctorId &&
                    entry.timeSlot.startTime.getTime() === timeSlot.startTime.getTime() &&
                    entry.timeSlot.endTime.getTime() === timeSlot.endTime.getTime()
            )
            .sort((a, b) => a.requestTime.getTime() - b.requestTime.getTime());

        return entries.length > 0 ? entries[0] : undefined;
    }

    removeFromWaitlist(entryId: string): boolean {
        return this.waitlist.delete(entryId);
    }

    getWaitlistByPatient(patientId: string): WaitlistEntry[] {
        return Array.from(this.waitlist.values()).filter(
            (entry) => entry.patient.id === patientId
        );
    }

    getWaitlistByDoctor(doctorId: string): WaitlistEntry[] {
        return Array.from(this.waitlist.values()).filter(
            (entry) => entry.doctor.id === doctorId
        );
    }
}
