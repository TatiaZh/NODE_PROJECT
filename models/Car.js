class Car {
    // disabled???
    constructor(brand, model, VIN, number, color, year, owner) {
        this.brand = brand;
        this.model = model;
        this.VIN = VIN;
        this.number = number;
        this.color = color;
        this.year = year;
        this.owner = owner;
        this.prevOwners = [];
        this.enabled = true;
    }

    update(brand, model, VIN, number, color, year, owner) {
        this.brand = brand || this.brand;
        this.model = model || this.model;
        this.VIN = VIN || this.VIN;
        this.number = number || this.number;
        this.color = color || this.color;
        this.year = year || this.year;
        if (this.owner !== owner) {
            this.prevOwners.push(this.owner);
        }
        this.owner = owner || this.owner;
    }

    enable(){
        this.enabled = true;
    }

    disable(){
        this.enabled = false;
    }
}
module.exports = Car;