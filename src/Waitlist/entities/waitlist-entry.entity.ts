import { Patient } from '../../Patients/entities/patient.entity';
import { Doctor } from '../../Doctors/entities/doctor.entity';

export class WaitlistEntry {
    id: string;
    patient: Patient;
    doctor: Doctor;
    timeSlot: { startTime: Date; endTime: Date };
    requestTime: Date;

    constructor(
        id: string,
        patient: Patient,
        doctor: Doctor,
        timeSlot: { startTime: Date; endTime: Date },
    ) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.timeSlot = timeSlot;
        this.requestTime = new Date();
    }
}