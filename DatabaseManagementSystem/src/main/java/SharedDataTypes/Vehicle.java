package SharedDataTypes;

public class Vehicle {
    private final int vehicle_ID;
    private int user_ID;
    private String license_plate;
    private String make;
    private String model;
    private int year;

    public Vehicle(int vehicle_ID, int user_ID, String license_plate, String make, String model, int year) {
        this.vehicle_ID = vehicle_ID;
        this.user_ID = user_ID;
        this.license_plate = license_plate;
        this.make = make;
        this.model = model;
        this.year = year;
    }

    public int getVehicle_ID() {
        return vehicle_ID;
    }

    public int getUser_ID() {
        return user_ID;
    }

    public String getLicense_plate() {
        return license_plate;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public int getYear() {
        return year;
    }

    public void setUser_ID(int user_ID) {
        this.user_ID = user_ID;
    }

    public void setLicense_plate(String license_plate) {
        this.license_plate = license_plate;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
