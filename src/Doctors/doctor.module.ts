import { Module } from '@nestjs/common';
import { DoctorsService } from './doctor.service';
import { DoctorsController } from './doctors.controller';
import { SlotsModule } from '../Slots/slot.module';

@Module({
    imports: [SlotsModule],
    controllers: [DoctorsController],
    providers: [DoctorsService],
    exports: [DoctorsService],
})
export class DoctorsModule { }