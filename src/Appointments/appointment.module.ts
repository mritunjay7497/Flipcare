import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { AppointmentsController } from './appointment.controller';
import { DoctorsModule } from '../Doctors/doctor.module';
import { PatientsModule } from '../Patients/patient.module';
import { SlotsModule } from '../Slots/slot.module';
import { WaitlistModule } from '../Waitlist/waitlist.module';

@Module({
    imports: [DoctorsModule, PatientsModule, SlotsModule, WaitlistModule],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentsModule { }