export interface Booking {
    id: string
    startTime: Date;
    endTime: Date;
    userId: string;
    vehicleId: string;
    checkedIn: boolean;
    vehicleId: string;
}

export interface Vehicle {
    id: string,
    license: string,
    make: string,
    model: string,
    year: number,
    color: string
}

export interface VehicleView{
    Make: string,
    Model: string
}

export interface EmissionsData {
    date: string;
    hour: number;
    emissionFactor: number;
}