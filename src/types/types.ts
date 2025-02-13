export interface Booking {
    id: string
    start: Date;
    end: Date;
}

export interface Vehicle {
    id: string,
    license: string,
    make: string,
    model: string,
    year: number,
    color: string
}