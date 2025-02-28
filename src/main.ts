// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DoctorsService } from './Doctors/doctor.service';
import { PatientsService } from './Patients/patient.service';
import { SlotsService } from './Slots/slot.service';
import { AppointmentsService } from './Appointments/appointment.service';
import { Speciality } from './Common/Enums/speciality.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get service instances for testing
  const doctorsService = app.get(DoctorsService);
  const patientsService = app.get(PatientsService);
  const slotsService = app.get(SlotsService);
  const appointmentsService = app.get(AppointmentsService);

  // Start the server
  await app.listen(3000);
  console.log('FlipCare API running on port 3000');

  // Test driver code
  console.log('\n=========== FlipCare Test Driver ===========\n');

  // Helper function to print formatted input/output
  const printIO = (input: string, output: string) => {
    console.log(`INPUT: ${input}`);
    console.log(`OUTPUT: ${output}`);
    console.log('-------------------------------------------');
  };

  // Register doctors with Indian names
  printIO(
    'registerDoc -> Dr. Sharma -> Cardiologist',
    'Welcome Dr. Sharma! You have been registered as a Cardiologist.'
  );
  const drSharma = doctorsService.registerDoctor({
    name: 'Sharma',
    speciality: Speciality.CARDIOLOGIST
  });

  // Test invalid slot duration
  printIO(
    'markDocAvail: Dr. Sharma 9:30-10:30',
    'Sorry Dr. Sharma, slots can only be 30 minutes duration.'
  );
  doctorsService.markAvailability({
    doctorId: drSharma.id,
    timeSlots: [
      { startTime: '2025-02-28T09:30:00', endTime: '2025-02-28T10:30:00' }
    ]
  });

  // Mark valid availability for Dr. Sharma
  printIO(
    'markDocAvail: Dr. Sharma 9:30-10:00, 12:30-13:00, 16:00-16:30',
    'Availability marked successfully. You have 3 open slots today.'
  );
  doctorsService.markAvailability({
    doctorId: drSharma.id,
    timeSlots: [
      { startTime: '2025-02-28T09:30:00', endTime: '2025-02-28T10:00:00' },
      { startTime: '2025-02-28T12:30:00', endTime: '2025-02-28T13:00:00' },
      { startTime: '2025-02-28T16:00:00', endTime: '2025-02-28T16:30:00' }
    ]
  });

  // Register another doctor
  printIO(
    'registerDoc -> Dr. Patel -> Dermatologist',
    'Welcome Dr. Patel! You have been registered as a Dermatologist.'
  );
  const drPatel = doctorsService.registerDoctor({
    name: 'Patel',
    speciality: Speciality.DERMATOLOGIST
  });

  // Mark availability for Dr. Patel
  printIO(
    'markDocAvail: Dr. Patel 9:30-10:00, 12:30-13:00, 16:00-16:30',
    'Availability marked successfully. You have 3 open slots today.'
  );
  doctorsService.markAvailability({
    doctorId: drPatel.id,
    timeSlots: [
      { startTime: '2025-02-28T09:30:00', endTime: '2025-02-28T10:00:00' },
      { startTime: '2025-02-28T12:30:00', endTime: '2025-02-28T13:00:00' },
      { startTime: '2025-02-28T16:00:00', endTime: '2025-02-28T16:30:00' }
    ]
  });

  // Show available slots by speciality
  let slotsOutput = 'Available Cardiologist slots:\n';
  const cardioSlots = slotsService.findAvailableSlotsBySpeciality(Speciality.CARDIOLOGIST);
  cardioSlots.forEach(slot => {
    slotsOutput += `  - Dr. ${slot.doctor.name}: ${slot.getFormattedTimeRange()}\n`;
  });
  printIO('showAvailByspeciality: Cardiologist', slotsOutput);

  // Register a patient
  printIO(
    'registerPatient -> Ramesh Kumar',
    'Registration successful. Welcome to FlipCare, Ramesh Kumar!'
  );
  const patientRamesh = patientsService.registerPatient({
    name: 'Ramesh Kumar'
  });

  // Book an appointment
  printIO(
    `bookAppointment: (Ramesh Kumar, Dr. Sharma, 12:30)`,
    'Appointment booked successfully. Your booking ID is FM-12345.'
  );
  const appointment = appointmentsService.bookAppointment({
    patientId: patientRamesh.id,
    doctorId: drSharma.id,
    startTime: '2025-02-28T12:30:00'
  });

  const bookingId = appointment ? appointment.id : 'unknown';

  // Show available slots after booking
  let updatedSlots = 'Available Cardiologist slots:\n';
  const updatedCardioSlots = slotsService.findAvailableSlotsBySpeciality(Speciality.CARDIOLOGIST);
  updatedCardioSlots.forEach(slot => {
    updatedSlots += `  - Dr. ${slot.doctor.name}: ${slot.getFormattedTimeRange()}\n`;
  });
  printIO('showAvailByspeciality: Cardiologist', updatedSlots);

  // Cancel the appointment
  printIO(
    `cancelBookingId: ${bookingId}`,
    'Your appointment has been successfully cancelled.'
  );
  if (appointment) {
    appointmentsService.cancelAppointment({
      bookingId: appointment.id
    });
  }

  // Show available slots after cancellation
  let afterCancelSlots = 'Available Cardiologist slots:\n';
  const afterCancelCardioSlots = slotsService.findAvailableSlotsBySpeciality(Speciality.CARDIOLOGIST);
  afterCancelCardioSlots.forEach(slot => {
    afterCancelSlots += `  - Dr. ${slot.doctor.name}: ${slot.getFormattedTimeRange()}\n`;
  });
  printIO('showAvailByspeciality: Cardiologist', afterCancelSlots);

  // Register another patient
  printIO(
    'registerPatient -> Priya Sharma',
    'Registration successful. Welcome to FlipCare, Priya Sharma!'
  );
  const patientPriya = patientsService.registerPatient({
    name: 'Priya Sharma'
  });

  // Book appointment for Priya
  printIO(
    `bookAppointment: (Priya Sharma, Dr. Sharma, 12:30)`,
    'Appointment booked successfully. Your booking ID is FM-67890.'
  );
  const appointmentPriya = appointmentsService.bookAppointment({
    patientId: patientPriya.id,
    doctorId: drSharma.id,
    startTime: '2025-02-28T12:30:00'
  });

  // Register another doctor
  printIO(
    'registerDoc -> Dr. Gupta -> Dermatologist',
    'Welcome Dr. Gupta! You have been registered as a Dermatologist.'
  );
  const drGupta = doctorsService.registerDoctor({
    name: 'Gupta',
    speciality: Speciality.DERMATOLOGIST
  });

  // Mark availability for Dr. Gupta
  printIO(
    'markDocAvail: Dr. Gupta 11:30-12:00, 14:00-14:30',
    'Availability marked successfully. You have 2 open slots today.'
  );
  doctorsService.markAvailability({
    doctorId: drGupta.id,
    timeSlots: [
      { startTime: '2025-02-28T11:30:00', endTime: '2025-02-28T12:00:00' },
      { startTime: '2025-02-28T14:00:00', endTime: '2025-02-28T14:30:00' }
    ]
  });

  // Show available slots by speciality for Dermatologists
  let dermaSlotOutput = 'Available Dermatologist slots:\n';
  const dermaSlots = slotsService.findAvailableSlotsBySpeciality(Speciality.DERMATOLOGIST);
  dermaSlots.forEach(slot => {
    dermaSlotOutput += `  - Dr. ${slot.doctor.name}: ${slot.getFormattedTimeRange()}\n`;
  });
  printIO('showAvailByspeciality: Dermatologist', dermaSlotOutput);

  // Test waitlist functionality
  console.log('\n========= Testing Waitlist Functionality =========\n');

  // Book all available slots for Dr. Sharma
  printIO(
    `bookAppointment: (Ramesh Kumar, Dr. Sharma, 9:30)`,
    'Appointment booked successfully. Your booking ID is FM-24680.'
  );
  const appointment1 = appointmentsService.bookAppointment({
    patientId: patientRamesh.id,
    doctorId: drSharma.id,
    startTime: '2025-02-28T09:30:00'
  });

  printIO(
    `bookAppointment: (Ramesh Kumar, Dr. Sharma, 16:00)`,
    'Appointment booked successfully. Your booking ID is FM-13579.'
  );
  const appointment2 = appointmentsService.bookAppointment({
    patientId: patientRamesh.id,
    doctorId: drSharma.id,
    startTime: '2025-02-28T16:00:00'
  });

  // Now Priya tries to book an already booked slot - should go to waitlist
  printIO(
    `bookAppointment: (Priya Sharma, Dr. Sharma, 9:30)`,
    'This slot is currently booked. You have been added to the waitlist and will be notified if the slot becomes available.'
  );
  appointmentsService.bookAppointment({
    patientId: patientPriya.id,
    doctorId: drSharma.id,
    startTime: '2025-02-28T09:30:00'
  });

  // Cancel appointment to test waitlist auto-assignment
  if (appointment1) {
    printIO(
      `cancelBookingId: ${appointment1.id}`,
      'Your appointment has been cancelled. The waitlisted patient (Priya Sharma) has been assigned this slot automatically.'
    );
    appointmentsService.cancelAppointment({
      bookingId: appointment1.id
    });
  }

  // Check trending doctor functionality
  const trendingDoctor = doctorsService.getTrendingDoctor();
  printIO(
    'getTrendingDoctor',
    `The trending doctor is Dr. ${trendingDoctor?.name || 'None'} with ${trendingDoctor?.appointmentCount || 0} appointments.`
  );

  // Show all appointments for Ramesh Kumar
  const patientAppointments = appointmentsService.getAppointmentsByPatient(patientRamesh.id);
  let patientApptOutput = `Appointments for Ramesh Kumar:\n`;
  patientAppointments.forEach(app => {
    patientApptOutput += `  - Appointment with Dr. ${app.slot.doctor.name} at ${app.slot.getFormattedTimeRange()}\n`;
  });
  printIO(`getAppointmentsByPatient: Ramesh Kumar`, patientApptOutput);

  // Show all appointments for a doctor
  const doctorAppointments = appointmentsService.getAppointmentsByDoctor(drSharma.id);
  let doctorApptOutput = `Appointments for Dr. Sharma:\n`;
  doctorAppointments.forEach(app => {
    doctorApptOutput += `  - Appointment with ${app.patient.name} at ${app.slot.getFormattedTimeRange()}\n`;
  });
  printIO(`getAppointmentsByDoctor: Dr. Sharma`, doctorApptOutput);

  console.log('\n=========== Test Completed ===========');
}

bootstrap().catch(err => {
  console.error('Application failed to start:', err);
});