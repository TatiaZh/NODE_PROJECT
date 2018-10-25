const express = require('express');
const path = require('path');
const Joi = require('joi');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

const User = require('./models/User');
const Car = require('./models/Car');

const usersDB = [];
const carsDB = [];

const user1 = new User("Tatia", "Zhodurishvili", "20001068024", "Levani", "1998-10-04");
const user2 = new User("Harry", "Potter", "12345678912", "James", "1980-07-31");
const car1 = new Car("BMW", 'M4', "1HGBH41JXMN109186", "OO-448-OO", "Gray", "2016", user2);
user2.cars.push(car1)
usersDB.push(user1);
usersDB.push(user2);

carsDB.push(car1)

app.get('/', (req, res) => {
    res.render('index', { title: "Welcome" });
});

app.get('/users/add', (req, res) => {
    res.render('users/addUser', { title: "Add User" });
});

app.post('/users/add', (req, res) => {
    const user = validateUser(req.body);
    if (user.error) {
        return res.status(400).send(user.error);
    }
    const { fName, lName, id, father, bDay } = user;
    for (let user of usersDB) {
        if (user.id === id) {
            return res.status(400).send('User already exists');
        }
    }
    usersDB.push(new User(fName, lName, id, father, bDay));
    let added = true;
    res.redirect(`/users/${user.id}`);
});

app.get('/users/find', (req, res) => {
    res.render('users/findUser', { title: "Find User" });
});

app.post('/users/find', (req, res) => {
    const { fName, lName, id } = req.body;
    const user = usersDB.find(user => user.id == id)
        || usersDB.find(user => user.fName == fName && user.lName == lName)
    if (!user) {
        res.status(404).send('User not found');
    }
    res.redirect(`/users/${user.id}`);
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const user = usersDB.find(user => user.id == id);
    if (!user) {
        res.status(404).send('User not found');
    }
    res.render(`users/showUser`, { title: "Show User", user });
})

app.get('/users/:id/edit', (req, res) => {
    const id = req.params.id;
    const user = usersDB.find(user => user.id == id);
    if (!user) {
        res.status(404).send('User not found');
    }
    res.render('users/editUser', { title: "Edit User", user });
});

app.post('/users/:id/edit', (req, res) => {
    const oldId = req.params.id;
    const user = usersDB.find(user => user.id == oldId);
    const updatedUser = validateUser(req.body);
    if (updatedUser.error) {
        return res.status(400).send(user.error);
    }
    const { fName, lName, id, father, bDay } = updatedUser;
    user.update(fName, lName, id, father, bDay);

    res.redirect(`/users/${user.id}`);
});

app.post('/configure/users/:id', (req, res) => {
    const id = req.params.id;
    const { del, enable, disable } = req.body;
    const user = usersDB.find(user => user.id == id);

    if (del) {
        usersDB.splice(usersDB.indexOf(user), 1);
        res.redirect(`/users/find`);
    }
    if (enable) {
        user.enable();
    }
    if (disable) {
        user.disable();
    }

    res.redirect(`/users/${user.id}`);
})

// ------------------------ CARS ----------------------------------- //

app.get('/cars/add', (req, res) => {
    // const users = usersDB.map(user => `${user.fName} ${user.lName}`);
    res.render('cars/addCar', { title: "Add Car", usersDB });
});

app.post('/cars/add', (req, res) => {
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


app.get('/cars/find', (req, res) => {
    // const users = usersDB.map(user => `${user.fName} ${user.lName}`);
    res.render('cars/findCar', { title: "Find Car" });
});

app.post('/cars/find', (req, res) => {
    const { VIN, number, brand, model } = req.body;
    const car = carsDB.find(car => car.VIN == VIN)
        || carsDB.find(car => car.number == number)
        || carsDB.find(car => car.brand == brand && car.model == model)
    if (!car) {
        return res.status(404).send('car not found');
    }

    res.redirect(`/cars/${car.VIN}`);
});

app.get('/cars/:VIN', (req, res) => {
    const VIN = req.params.VIN;
    const car = carsDB.find(car => car.VIN == VIN);
    if (!car) {
        res.status(404).send('car not found');
    }
    res.render(`cars/showCar`, { title: "Show Car", car });
})

app.get('/cars/:VIN/edit', (req, res) => {
    const VIN = req.params.VIN;
    const car = carsDB.find(car => car.VIN == VIN);
    // const users = usersDB.map(user => `${user.fName} ${user.lName}`);

    if (!car) {
        res.status(404).send('Car not found');
    }

    res.render('cars/editCar', { title: "Edit Car", car, usersDB });
});

app.post('/cars/:VIN/edit', (req, res) => {
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

app.post('/configure/cars/:VIN', (req, res) => {
    const VIN = req.params.VIN;
    const { del, enable, disable } = req.body;
    const car = carsDB.find(car => car.VIN == VIN);

    if (del) {
        carsDB.splice(carsDB.indexOf(car), 1);
        car.owner.cars.splice(car.owner.cars.indexOf(car), 1);
        res.redirect(`/cars/find`);
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

// -------------------------------------------------------- //

app.listen(PORT, () => {
    console.log(`Started at port ${PORT}`)
})

function validateUser(user) {
    const { fName, lName, id } = user;
    const father = user.father || 'Not Provided';
    const bDay = user.bDay || 'Not Provided';
    if (!/[a-zA-Z]+/.test(fName) || !/[a-zA-Z]+/.test(lName) || !/[a-zA-Z]+/.test(father)) {
        return { error: 'First Name/Last Name/Father\'s Name must be in string format' }
    }
    if (!/^\d{11}$/.test(id)) {
        return { error: 'Id must be all digits and 11 characters long' }
    }
    if (!/\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/.test(bDay) && bDay !== 'Not Provided') {
        return { error: 'Birthday must be in YYYY-MM-DD format' }
    }
    return { fName, lName, id, father, bDay };
}

function validateCar(car) {
    const { VIN, number } = car;
    const { brand, model, color, year, owner } = car || 'Not Provided';
    if ((!/[a-zA-Z]+/.test(brand) && brand !== 'Not Provided')
        || (!/[a-zA-Z]+/.test(color) && color !== 'Not Provided')
        || (!/[a-zA-Z]+/.test(owner) && owner !== 'Not Provided')) {
        return { error: 'Brand/Color/Owner must be in string format' }
    }
    if (!VIN || VIN.length !== 17) {
        return { error: 'VIN must 17 characters long' }
    }
    if (!number || !/[a-zA-Z]{2}-\d{3}-[a-zA-Z]{2}/.test(number)) {
        return { error: 'Number must be in XX-000-XX format' }
    }
    if (!/19\d{2}|20\d{2}/.test(year) && year !== 'Not Provided') {
        return { error: 'Year is not valid' }
    }
    return { VIN, number, brand, model, color, year, owner };
}