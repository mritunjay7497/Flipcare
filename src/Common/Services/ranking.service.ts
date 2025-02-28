import { Injectable } from '@nestjs/common';
import { SlotRanker } from '../Interfaces/slot-ranker.interface';
import { Slot } from '../../Slots/entities/slot.entity';

@Injectable()
export class RankingService implements SlotRanker {
    rankSlots(slots: Slot[]): Slot[] {
        // Default implementation sorts by start time
        return [...slots].sort((a, b) =>
            a.startTime.getTime() - b.startTime.getTime()
        );
    }
}

// Implementation of a rating-based ranker could be added in the future
// This demonstrates the extensibility of the ranking mechanism
export class DoctorRatingRanker implements SlotRanker {
    rankSlots(slots: Slot[]): Slot[] {
        return [...slots].sort((a, b) =>
            b.doctor.rating - a.doctor.rating ||
            a.startTime.getTime() - b.startTime.getTime()
        );
    }
}