class User {
    // disabled???
    constructor(fName, lName, id, father, bDay) {
        this.fName = fName;
        this.lName = lName;
        this.id = id;
        this.father = father;
        this.bDay = bDay;
        this.cars = [];
        this.enabled = true;
    }

    update(fName, lName, id, father, bDay) {
        this.fName = fName || this.fName;
        this.lName = lName || this.lName;
        this.id = id || this.id;
        this.father = father || this.father;
        this.bDay = bDay || this.bDay;
    }

    enable(){
        this.enabled = true;
    }

    disable(){
        this.enabled = false;
    }

}
module.exports = User;