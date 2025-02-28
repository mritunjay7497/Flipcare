import { Speciality } from '../../Common/Enums/speciality.enum';

export class Doctor {
    id: string;
    name: string;
    speciality: Speciality;
    rating: number;
    appointmentCount: number = 0;

    constructor(id: string, name: string, speciality: Speciality) {
        this.id = id;
        this.name = name;
        this.speciality = speciality;
        this.rating = 0; // Default rating
    }
}