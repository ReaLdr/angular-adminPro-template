import { Hospital } from "./hospital.models";

interface _MedicoUser {
    nombre: string;
    _id: string;
    img?: string;
}

export class Medico {

    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _MedicoUser,
        public hospital?: Hospital
    ) {}

}