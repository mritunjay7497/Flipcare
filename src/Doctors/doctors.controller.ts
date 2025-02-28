import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { DoctorsService } from './doctor.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { MarkAvailabilityDto } from './dto/mark-availability.dto';
import { Doctor } from './entities/doctor.entity';
import { Speciality } from '../Common/Enums/speciality.enum';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Post('register')
    registerDoctor(@Body() registerDoctorDto: RegisterDoctorDto) {
        const doctor = this.doctorsService.registerDoctor(registerDoctorDto);
        return {
            message: `Welcome Dr. ${doctor.name} !!`,
            doctor,
        };
    }

    @Put('availability')
    markAvailability(@Body() markAvailabilityDto: MarkAvailabilityDto) {
        const result = this.doctorsService.markAvailability(markAvailabilityDto);
        return {
            message: result ? 'Done Doc!' : 'Sorry Dr., slots are 30 mins only',
        };
    }

    @Get('speciality/:speciality')
    findBySpeciality(@Param('speciality') speciality: Speciality) {
        return this.doctorsService.findBySpeciality(speciality);
    }

    @Get('trending')
    getTrendingDoctor() {
        return this.doctorsService.getTrendingDoctor();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.doctorsService.findById(id);
    }

    @Get()
    getAllDoctors() {
        return this.doctorsService.getAllDoctors();
    }
}
