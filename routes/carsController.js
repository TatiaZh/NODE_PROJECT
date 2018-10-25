const express = require('express')
const router = express.Router()
const usersController = require('../routes/usersController');
const usersDB = usersController.usersDB;

const Car = require('../models/Car');
const User = require('../models/User'); //only to have base data, not needed in real 
const validateCar = require('../models/Validator').validateCar;

const carsDB = [];
const user2 = new User("Harry", "Potter", "12345678912", "James", "1980-07-31"); //only to have base data, not needed in real 
const car1 = new Car("BMW", 'M4', "1HGBH41JXMN109186", "OO-448-OO", "Gray", "2016", user2);
user2.cars.push(car1);
carsDB.push(car1);



router.route('/cars/add').get((req, res) => {
    // const users = usersDB.map(user => `${user.fName} ${user.lName}`);
    res.render('cars/addCar', { title: "Add Car", usersDB });
});

router.route('/cars/add').post((req, res) => {
    const car = validateCar(req.body);
    if (car.error) {
        return res.status(400).send(car.error);
    }
    const { brand, model, VIN, number, color, year, owner } = car;
    for (let car of carsDB) {
        if (car.VIN === VIN) {
            return res.status(400).send('Car already exists');
        }
    }

    const fName = owner.split(' ')[0];
    const lName = owner.split(' ')[1];
    const user = usersDB.find(user => user.fName == fName && user.lName == lName);

    const newCar = new Car(brand, model, VIN, number, color, year, user)
    carsDB.push(newCar);
    user.cars.push(newCar);

    res.redirect(`/cars/${VIN}`);
});


router.route('/cars/find').get((req, res) => {
    // const users = usersDB.map(user => `${user.fName} ${user.lName}`);
    res.render('cars/findCar', { title: "Find Car" });
});

router.route('/cars/find').post((req, res) => {
    const { VIN, number, brand, model } = req.body;
    const car = carsDB.find(car => car.VIN == VIN)
        || carsDB.find(car => car.number == number)
        || carsDB.find(car => car.brand == brand && car.model == model)
    if (!car) {
        return res.status(404).send('car not found');
    }

    res.redirect(`/cars/${car.VIN}`);
});

router.route('/cars/:VIN').get((req, res) => {
    const VIN = req.params.VIN;
    const car = carsDB.find(car => car.VIN == VIN);
    if (!car) {
        return res.status(404).send('car not found');
    }
    res.render(`cars/showCar`, { title: "Show Car", car });
})

router.route('/cars/:VIN/edit').get((req, res) => {
    const VIN = req.params.VIN;
    const car = carsDB.find(car => car.VIN == VIN);
    // const users = usersDB.map(user => `${user.fName} ${user.lName}`);

    if (!car) {
        return res.status(404).send('Car not found');
    }

    res.render('cars/editCar', { title: "Edit Car", car, usersDB });
});

router.route('/cars/:VIN/edit').post((req, res) => {
    const oldVIN = req.params.VIN;
    const car = carsDB.find(car => car.VIN == oldVIN);
    let user = usersDB.find(user => user.id === car.owner.id);
    const updatedCar = validateCar(req.body);
    if (updatedCar.error) {
        return res.status(400).send(car.error);
    }

    user.cars.splice(user.cars.indexOf(car), 1);

    const { brand, model, VIN, number, color, year, owner } = updatedCar;
    const fName = owner.split(' ')[0];
    const lName = owner.split(' ')[1];
    user = usersDB.find(user => user.fName == fName && user.lName == lName);
    car.update(brand, model, VIN, number, color, year, user);
    user.cars.push(car);

    res.redirect(`/cars/${car.VIN}`);
});

module.exports = {
    router,
    carsDB
}