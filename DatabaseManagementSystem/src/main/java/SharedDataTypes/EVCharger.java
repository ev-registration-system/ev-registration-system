package SharedDataTypes;

public class EVCharger {
    private String serialNumber;
    private String location;
    private String level;

    public EVCharger(String serialNumber, String location, String level){
        this.serialNumber = serialNumber;
        this.location = location;
        this.level = level;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public String getLocation() {
        return location;
    }

    public String getLevel() {
        return level;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
