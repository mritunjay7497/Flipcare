import { Module } from '@nestjs/common';
import { DoctorsModule } from './Doctors/doctor.module';
import { PatientsModule } from './Patients/patient.module';
import { AppointmentsModule } from './Appointments/appointment.module';
import { SlotsModule } from './Slots/slot.module';
import { WaitlistModule } from './Waitlist/waitlist.module';

@Module({
    imports: [
        DoctorsModule,
        PatientsModule,
        AppointmentsModule,
        SlotsModule,
        WaitlistModule,
    ],
})
export class AppModule { }
