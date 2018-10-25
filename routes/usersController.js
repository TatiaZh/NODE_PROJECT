const express = require('express')
const router = express.Router()

const User = require('../models/User');
const validateUser = require('../models/Validator').validateUser;

const usersDB = [];

const user1 = new User("Hermione", "Granger", "98765432100", "John", "1979-09-19");
const user2 = new User("Harry", "Potter", "12345678912", "James", "1980-07-31");
const user3 = new User("Ron", "Weasley", "32165498711", "Arthur", "1980-03-01");

usersDB.push(user1);
usersDB.push(user2);
usersDB.push(user3);

router.route('/users/add').get((req, res) => {
    res.render('users/addUser', { title: "Add User" });
});

router.route('/users/add').post((req, res) => {
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

router.route('/users/find').get((req, res) => {
    res.render('users/findUser', { title: "Find User" });
});

router.route('/users/find').post((req, res) => {
    const { fName, lName, id } = req.body;
    const user = usersDB.find(user => user.id == id)
        || usersDB.find(user => user.fName == fName && user.lName == lName)
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.redirect(`/users/${user.id}`);
});

router.route('/users/:id').get((req, res) => {
    const id = req.params.id;
    const user = usersDB.find(user => user.id == id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render(`users/showUser`, { title: "Show User", user });
})

router.route('/users/:id/edit').get((req, res) => {
    const id = req.params.id;
    const user = usersDB.find(user => user.id == id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    res.render('users/editUser', { title: "Edit User", user });
});

router.route('/users/:id/edit').post((req, res) => {
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

module.exports = {
    router,
    usersDB
}