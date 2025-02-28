import { Injectable } from '@nestjs/common';
import { Doctor } from './entities/doctor.entity';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { MarkAvailabilityDto, TimeSlot } from './dto/mark-availability.dto';
import { Speciality } from '../Common/Enums/speciality.enum';
import { v4 as uuidv4 } from 'uuid';
import { SlotsService } from '../Slots/slot.service';

@Injectable()
export class DoctorsService {
    private doctors: Map<string, Doctor> = new Map();

    constructor(private readonly slotsService: SlotsService) { }

    registerDoctor(registerDoctorDto: RegisterDoctorDto): Doctor {
        const id = uuidv4();
        const doctor = new Doctor(id, registerDoctorDto.name, registerDoctorDto.speciality);
        this.doctors.set(id, doctor);
        return doctor;
    }

    findById(id: string): Doctor | undefined {
        return this.doctors.get(id);
    }

    findBySpeciality(speciality: Speciality): Doctor[] {
        return Array.from(this.doctors.values()).filter(
            (doctor) => doctor.speciality === speciality,
        );
    }

    markAvailability(markAvailabilityDto: MarkAvailabilityDto): boolean {
        const doctor = this.findById(markAvailabilityDto.doctorId);

        if (!doctor) {
            return false;
        }

        // Validate all slots are 30 minutes
        for (const timeSlot of markAvailabilityDto.timeSlots) {
            const startTime = new Date(timeSlot.startTime);
            const endTime = new Date(timeSlot.endTime);
            const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

            if (durationInMinutes !== 30) {
                return false;
            }
        }

        // Create slots for the doctor
        for (const timeSlot of markAvailabilityDto.timeSlots) {
            this.slotsService.createSlot(
                doctor,
                new Date(timeSlot.startTime),
                new Date(timeSlot.endTime),
            );
        }

        return true;
    }

    getTrendingDoctor(): Doctor | null {
        let trendingDoctor: Doctor | null = null;
        let maxAppointments = 0;

        for (const doctor of this.doctors.values()) {
            if (doctor.appointmentCount > maxAppointments) {
                maxAppointments = doctor.appointmentCount;
                trendingDoctor = doctor;
            }
        }

        return trendingDoctor;
    }

    getAllDoctors(): Doctor[] {
        return Array.from(this.doctors.values());
    }
}