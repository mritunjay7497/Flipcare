import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PatientsService } from './patient.service';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Post('register')
    registerPatient(@Body() registerPatientDto: RegisterPatientDto) {
        const patient = this.patientsService.registerPatient(registerPatientDto);
        return {
            message: 'Registration successful',
            patient,
        };
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.patientsService.findById(id);
    }

    @Get()
    getAllPatients() {
        return this.patientsService.getAllPatients();
    }
}
