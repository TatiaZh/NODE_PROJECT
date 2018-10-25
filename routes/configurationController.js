const express = require('express');
const router = express.Router();
const usersController = require('../routes/usersController');
const usersDB = usersController.usersDB;
const carsController = require('../routes/carsController');
const carsDB = carsController.carsDB;


router.route('/configure/cars/:VIN').post((req, res) => {
    const VIN = req.params.VIN;
    const { del, enable, disable } = req.body;
    const car = carsDB.find(car => car.VIN == VIN);

    if (del) {
        carsDB.splice(carsDB.indexOf(car), 1);
        car.owner.cars.splice(car.owner.cars.indexOf(car), 1);
        return res.redirect(`/`);
    }
    if (enable) {
        car.enable();
        car.owner.cars.push(car);
    }
    if (disable) {
        car.disable();
        car.owner.cars.splice(car.owner.cars.indexOf(car), 1);
    }

    res.redirect(`/cars/${car.VIN}`);
})

router.route('/configure/users/:id').post((req, res) => {
    const id = req.params.id;
    const { del, enable, disable } = req.body;
    const user = usersDB.find(user => user.id == id);

    if (del) {
        usersDB.splice(usersDB.indexOf(user), 1);
        return res.redirect(`/`);
    }
    if (enable) {
        user.enable();
    }
    if (disable) {
        user.disable();
    }

    res.redirect(`/users/${user.id}`);
})

module.exports = router;