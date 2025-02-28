import { Slot } from '../../Slots/entities/slot.entity';

export interface SlotRanker {
    rankSlots(slots: Slot[]): Slot[];
}
