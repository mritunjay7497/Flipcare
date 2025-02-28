import { Injectable } from '@nestjs/common';
import { Patient } from './entities/patient.entity';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PatientsService {
    private patients: Map<string, Patient> = new Map();

    registerPatient(registerPatientDto: RegisterPatientDto): Patient {
        const id = uuidv4();
        const patient = new Patient(id, registerPatientDto.name);
        this.patients.set(id, patient);
        return patient;
    }

    findById(id: string): Patient | undefined {
        return this.patients.get(id);
    }

    getAllPatients(): Patient[] {
        return Array.from(this.patients.values());
    }
}