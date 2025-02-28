import { Module } from '@nestjs/common';
import { SlotsService } from './slot.service';
import { RankingService } from '../Common/Services/ranking.service';

@Module({
    providers: [SlotsService, RankingService],
    exports: [SlotsService, RankingService],
})
export class SlotsModule { }