import { Module } from '@nestjs/common';
import { PatientsService } from './patient.service';
import { PatientsController } from './patient.controller';

@Module({
    controllers: [PatientsController],
    providers: [PatientsService],
    exports: [PatientsService],
})
export class PatientsModule { }