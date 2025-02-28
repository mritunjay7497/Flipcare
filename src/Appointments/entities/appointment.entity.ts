import { Patient } from '../../Patients/entities/patient.entity';
import { Slot } from '../../Slots/entities/slot.entity';

export class Appointment {
    id: string;
    patient: Patient;
    slot: Slot;
    bookingTime: Date;

    constructor(id: string, patient: Patient, slot: Slot) {
        this.id = id;
        this.patient = patient;
        this.slot = slot;
        this.bookingTime = new Date();
    }
}