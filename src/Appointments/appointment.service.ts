import { Injectable } from '@nestjs/common';
import { Appointment } from './entities/appointment.entity';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { DoctorsService } from '../Doctors/doctor.service';
import { PatientsService } from '../Patients/patient.service';
import { SlotsService } from '../Slots/slot.service';
import { WaitlistService } from '../Waitlist/waitlist.service';
import { SlotStatus } from '../Common/Enums/slot-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { Slot } from 'src/Slots/entities/slot.entity';

@Injectable()
export class AppointmentsService {
    private appointments: Map<string, Appointment> = new Map();

    constructor(
        private readonly doctorsService: DoctorsService,
        private readonly patientsService: PatientsService,
        private readonly slotsService: SlotsService,
        private readonly waitlistService: WaitlistService,
    ) { }

    bookAppointment(bookAppointmentDto: BookAppointmentDto): Appointment | null {
        const patient = this.patientsService.findById(bookAppointmentDto.patientId);
        const doctor = this.doctorsService.findById(bookAppointmentDto.doctorId);

        if (!patient || !doctor) {
            return null;
        }

        const startTime = new Date(bookAppointmentDto.startTime);
        const slot = this.slotsService.findAvailableSlotByDoctorAndTime(doctor.id, startTime);

        if (!slot) {
            // Check if the slot is booked, then add to waitlist
            // This is a simplified implementation
            this.waitlistService.addToWaitlist(patient, doctor, {
                startTime,
                endTime: new Date(startTime.getTime() + 30 * 60 * 1000), // 30 minutes later
            });
            return null;
        }

        // Check if patient has conflicting appointments
        const patientSlots = this.getPatientBookedSlots(patient.id);
        const hasConflict = patientSlots.some(
            (existingSlot) =>
                existingSlot.startTime.getTime() === startTime.getTime()
        );

        if (hasConflict) {
            return null;
        }

        // Create appointment
        const id = uuidv4();
        const appointment = new Appointment(id, patient, slot);
        this.appointments.set(id, appointment);

        // Update slot status
        this.slotsService.updateSlotStatus(slot.id, SlotStatus.BOOKED);

        // Increment doctor's appointment count
        doctor.appointmentCount++;

        return appointment;
    }

    cancelAppointment(cancelAppointmentDto: CancelAppointmentDto): boolean {
        const appointment = this.appointments.get(cancelAppointmentDto.bookingId);

        if (!appointment) {
            return false;
        }

        // Free up the slot
        this.slotsService.updateSlotStatus(appointment.slot.id, SlotStatus.AVAILABLE);

        // Decrement doctor's appointment count
        appointment.slot.doctor.appointmentCount--;

        // Remove the appointment
        this.appointments.delete(cancelAppointmentDto.bookingId);

        // Check waitlist for this slot and automatically book if there's someone waiting
        const waitlistEntry = this.waitlistService.getNextInWaitlist(
            appointment.slot.doctor.id,
            {
                startTime: appointment.slot.startTime,
                endTime: appointment.slot.endTime,
            }
        );

        if (waitlistEntry) {
            this.bookAppointment({
                patientId: waitlistEntry.patient.id,
                doctorId: waitlistEntry.doctor.id,
                startTime: waitlistEntry.timeSlot.startTime.toISOString(),
            });
            this.waitlistService.removeFromWaitlist(waitlistEntry.id);
        }

        return true;
    }

    getAppointmentsByPatient(patientId: string): Appointment[] {
        return Array.from(this.appointments.values()).filter(
            (appointment) => appointment.patient.id === patientId
        );
    }

    getAppointmentsByDoctor(doctorId: string): Appointment[] {
        return Array.from(this.appointments.values()).filter(
            (appointment) => appointment.slot.doctor.id === doctorId
        );
    }

    getPatientBookedSlots(patientId: string): Slot[] {
        return this.getAppointmentsByPatient(patientId).map(
            (appointment) => appointment.slot
        );
    }

    getAllAppointments(): Appointment[] {
        return Array.from(this.appointments.values());
    }
}