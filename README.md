# FlipCare API Documentation

FlipCare is a healthcare appointment scheduling system that connects patients with doctors. This document provides detailed information about the API contracts for the application.

# Please run `npm start` to install necessary packages and start the project

## Table of Contents
- [Overview](#overview)
- [Entities](#entities)
- [API Endpoints](#api-endpoints)
  - [Doctor APIs](#doctor-apis)
  - [Patient APIs](#patient-apis)
  - [Appointment APIs](#appointment-apis)
  - [Slot APIs](#slot-apis)
  - [Waitlist APIs](#waitlist-apis)
- [Data Models](#data-models)
- [Business Rules](#business-rules)
- [Error Handling](#error-handling)

## Overview

FlipCare divides each day into 30-minute slots from 9 AM to 9 PM. Doctors declare their availability in these slots, and patients can book appointments based on availability. The system also supports features like appointment cancellation, waitlisting, and trending doctor identification.

## Entities

The system consists of five main entities:

1. **Doctor**: Healthcare professionals with specialities
2. **Patient**: Users who book appointments with doctors
3. **Slot**: 30-minute time blocks that doctors mark as available
4. **Appointment**: Booking of a patient with a doctor for a specific slot
5. **Waitlist Entry**: Request to book an already-booked slot

## API Endpoints

### Doctor APIs

#### Register Doctor
Creates a new doctor account with speciality.

**Endpoint**: `POST /doctors/register`

**Request**:
```json
{
  "name": "string",
  "speciality": "Cardiologist | Dermatologist | Orthopedic | General Physician"
}
```

**Response**:
```json
{
  "message": "Welcome Dr. {name} !!",
  "doctor": {
    "id": "string",
    "name": "string",
    "speciality": "string",
    "rating": 0,
    "appointmentCount": 0
  }
}
```

#### Mark Doctor Availability
Set available time slots for a doctor.

**Endpoint**: `PUT /doctors/availability`

**Request**:
```json
{
  "doctorId": "string",
  "timeSlots": [
    {
      "startTime": "2025-02-28T09:30:00",
      "endTime": "2025-02-28T10:00:00"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Done Doc! | Sorry Dr., slots are 30 mins only"
}
```

#### Get Doctor by ID
Retrieves a specific doctor's details.

**Endpoint**: `GET /doctors/{id}`

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "speciality": "string",
  "rating": 0,
  "appointmentCount": 0
}
```

#### Get Doctors by Speciality
Lists all doctors of a given speciality.

**Endpoint**: `GET /doctors/speciality/{speciality}`

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "speciality": "string",
    "rating": 0,
    "appointmentCount": 0
  }
]
```

#### Get Trending Doctor
Returns the doctor with the most appointments.

**Endpoint**: `GET /doctors/trending`

**Response**:
```json
{
  "id": "string",
  "name": "string",
  "speciality": "string",
  "rating": 0,
  "appointmentCount": 10
}
```

#### Get All Doctors
Lists all doctors in the system.

**Endpoint**: `GET /doctors`

**Response**:
```json
[
  {
    "id": "string",
    "name": "string",
    "speciality": "string",
    "rating": 0,
    "appointmentCount": 0
  }
]
```

### Patient APIs

#### Register Patient
Creates a new patient account.

**Endpoint**: `POST /patients/register`

**Request**:
```json
{
  "name": "string"
}
```

**Response**:
```json
{
  "message": "Registration successful",
  "patient": {
    "id": "string",
    "name": "string"
  }
}
```

#### Get Patient by ID
Retrieves a specific patient's details.

**Endpoint**: `GET /patients/{id}`

**Response**:
```json
{
  "id": "string",
  "name": "string"
}
```

#### Get All Patients
Lists all patients in the system.

**Endpoint**: `GET /patients`

**Response**:
```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

### Appointment APIs

#### Book Appointment
Books an appointment for a patient with a doctor.

**Endpoint**: `POST /appointments/book`

**Request**:
```json
{
  "patientId": "string",
  "doctorId": "string",
  "startTime": "2025-02-28T12:30:00"
}
```

**Response (Success)**:
```json
{
  "message": "Booked. Booking id: {bookingId}",
  "appointment": {
    "id": "string",
    "patient": {
      "id": "string",
      "name": "string"
    },
    "slot": {
      "id": "string",
      "doctor": {
        "id": "string",
        "name": "string",
        "speciality": "string"
      },
      "startTime": "2025-02-28T12:30:00",
      "endTime": "2025-02-28T13:00:00",
      "status": "BOOKED"
    },
    "bookingTime": "2025-02-28T08:15:32"
  }
}
```

**Response (Failure - Added to Waitlist)**:
```json
{
  "message": "Booking failed. Slot not available or conflicting appointment. Added to waitlist."
}
```

#### Cancel Appointment
Cancels an existing appointment.

**Endpoint**: `DELETE /appointments/cancel`

**Request**:
```json
{
  "bookingId": "string"
}
```

**Response**:
```json
{
  "message": "Booking Cancelled | Booking not found"
}
```

#### Get Available Slots by Speciality
Lists all available slots for doctors of a particular speciality.

**Endpoint**: `GET /appointments/available/{speciality}`

**Response**:
```json
[
  {
    "doctor": "Dr.Sharma",
    "timeSlot": "9:30 AM-10:00 AM"
  },
  {
    "doctor": "Dr.Sharma",
    "timeSlot": "4:00 PM-4:30 PM"
  }
]
```

#### Get Appointments by Patient
Lists all appointments for a specific patient.

**Endpoint**: `GET /appointments/patient/{patientId}`

**Response**:
```json
[
  {
    "id": "string",
    "patient": {
      "id": "string",
      "name": "string"
    },
    "slot": {
      "id": "string",
      "doctor": {
        "id": "string",
        "name": "string",
        "speciality": "string"
      },
      "startTime": "2025-02-28T12:30:00",
      "endTime": "2025-02-28T13:00:00",
      "status": "BOOKED"
    },
    "bookingTime": "2025-02-28T08:15:32"
  }
]
```

#### Get Appointments by Doctor
Lists all appointments for a specific doctor.

**Endpoint**: `GET /appointments/doctor/{doctorId}`

**Response**:
```json
[
  {
    "id": "string",
    "patient": {
      "id": "string",
      "name": "string"
    },
    "slot": {
      "id": "string",
      "doctor": {
        "id": "string",
        "name": "string",
        "speciality": "string"
      },
      "startTime": "2025-02-28T12:30:00",
      "endTime": "2025-02-28T13:00:00",
      "status": "BOOKED"
    },
    "bookingTime": "2025-02-28T08:15:32"
  }
]
```

#### Get All Appointments
Lists all appointments in the system.

**Endpoint**: `GET /appointments`

**Response**:
```json
[
  {
    "id": "string",
    "patient": {
      "id": "string",
      "name": "string"
    },
    "slot": {
      "id": "string",
      "doctor": {
        "id": "string",
        "name": "string",
        "speciality": "string"
      },
      "startTime": "2025-02-28T12:30:00",
      "endTime": "2025-02-28T13:00:00",
      "status": "BOOKED"
    },
    "bookingTime": "2025-02-28T08:15:32"
  }
]
```

## Data Models

### Doctor
```typescript
{
  id: string;
  name: string;
  speciality: Speciality; // Enum: CARDIOLOGIST, DERMATOLOGIST, ORTHOPEDIC, GENERAL_PHYSICIAN
  rating: number;
  appointmentCount: number;
}
```

### Patient
```typescript
{
  id: string;
  name: string;
}
```

### Slot
```typescript
{
  id: string;
  doctor: Doctor;
  startTime: Date;
  endTime: Date;
  status: SlotStatus; // Enum: AVAILABLE, BOOKED
}
```

### Appointment
```typescript
{
  id: string;
  patient: Patient;
  slot: Slot;
  bookingTime: Date;
}
```

### WaitlistEntry
```typescript
{
  id: string;
  patient: Patient;
  doctor: Doctor;
  timeSlot: {
    startTime: Date;
    endTime: Date;
  };
  requestTime: Date;
}
```

## Business Rules

1. **Time Slots**:
   - Each slot must be exactly 30 minutes
   - Slots can range from 9 AM to 9 PM

2. **Doctor Availability**:
   - Doctors can declare availability for multiple slots
   - Availability is set for the current day only

3. **Booking Rules**:
   - A slot can be booked by only one patient at a time
   - A patient cannot book two appointments with different doctors at the same time
   - A patient can book multiple appointments in a day (at different times)

4. **Waitlist Rules**:
   - If a slot is already booked, the patient can join the waitlist
   - When a booked slot is canceled, it's assigned to the first patient in the waitlist
   - Waitlist is processed in FIFO (First In, First Out) order

5. **Slot Ranking**:
   - By default, available slots are ordered by start time
   - The ranking mechanism is designed to be extensible for future enhancements (e.g., sorting by doctor rating)

6. **Trending Doctor**:
   - The system tracks the doctor with the most appointments
   - Appointment count is incremented when a booking is made and decremented when canceled

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Request was successful
- `201 Created`: Resource was successfully created
- `400 Bad Request`: Invalid input data (e.g., slot duration not 30 minutes)
- `404 Not Found`: Resource not found (e.g., doctor, patient, or appointment)
- `409 Conflict`: Conflict with current state (e.g., slot already booked)

Each error response includes a descriptive message to help identify the issue.