import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { SlotsService } from '../Slots/slot.service';
import { Speciality } from '../Common/Enums/speciality.enum';

@Controller('appointments')
export class AppointmentsController {
    constructor(
        private readonly appointmentsService: AppointmentsService,
        private readonly slotsService: SlotsService,
    ) { }

    @Post('book')
    bookAppointment(@Body() bookAppointmentDto: BookAppointmentDto) {
        const appointment = this.appointmentsService.bookAppointment(bookAppointmentDto);
        if (!appointment) {
            return {
                message: 'Booking failed. Slot not available or conflicting appointment.',
            };
        }
        return {
            message: `Booked. Booking id: ${appointment.id}`,
            appointment,
        };
    }

    @Delete('cancel')
    cancelAppointment(@Body() cancelAppointmentDto: CancelAppointmentDto) {
        const result = this.appointmentsService.cancelAppointment(cancelAppointmentDto);
        return {
            message: result ? 'Booking Cancelled' : 'Booking not found',
        };
    }

    @Get('available/:speciality')
    getAvailableSlotsBySpeciality(@Param('speciality') speciality: Speciality) {
        const slots = this.slotsService.findAvailableSlotsBySpeciality(speciality);
        return slots.map(slot => ({
            doctor: `Dr.${slot.doctor.name}`,
            timeSlot: slot.getFormattedTimeRange(),
        }));
    }

    @Get('patient/:patientId')
    getAppointmentsByPatient(@Param('patientId') patientId: string) {
        return this.appointmentsService.getAppointmentsByPatient(patientId);
    }

    @Get('doctor/:doctorId')
    getAppointmentsByDoctor(@Param('doctorId') doctorId: string) {
        return this.appointmentsService.getAppointmentsByDoctor(doctorId);
    }

    @Get()
    getAllAppointments() {
        return this.appointmentsService.getAllAppointments();
    }
}